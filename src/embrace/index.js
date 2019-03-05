'use strict';
const net = require('net');

module.exports = function(common) {
  const logger = common.logger('ANP-EMBRACE');
  let reconnectTimes = 0;

  function createController() {}

  function createClient() {
    const client = new net.Socket();
    const _info = {
      pid: process.pid,
      server: common.config.embrace.machine_unique_key
    };

    const controller = {};
    const ctx = {controller, ..._info};
    require('./controller')(common).tcp.call(ctx);

    const heartbeatMessage = common.socket.compose(
      common.config.message.type.req,
      0,
      {..._info}
    );

    function _callback() {
      logger.info(
        `[${process.pid}] connect to ${common.config.host_tcp}:${
          common.config.port_tcp
        } success ...`
      );
      common.socket.send(client, heartbeatMessage);
    }

    client.on('data', common.socket.onData.bind(ctx, client));

    function _connect() {
      client.connect(common.config.port_tcp, common.config.host_tcp, _callback);
    }

    _connect();

    setInterval(
      () => common.socket.send(client, heartbeatMessage),
      common.config.socket.tcp_heartbeat
    );

    client.on('error', function(err) {
      logger.debug(`tcp client => pid ${process.pid} error : ${err}`);
    });

    client.on('close', function() {
      if (++reconnectTimes >= common.config.socket.reconnect_limit) {
        common.utils.event.emit(common.config.fork_restart);
        reconnectTimes = 0;
      }
      logger.debug(
        `tcp client->close pid ${process.pid}, tcp connection closed`
      );
      client.removeListener('connect', _callback);
      client.destroy();
      setTimeout(_connect, common.config.socket.reconnect_time);
    });
  }

  return {
    client: createClient(),
    controller: createController()
  };
};
