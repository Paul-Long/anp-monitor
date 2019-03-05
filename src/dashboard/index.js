'use strict';
const net = require('net');
const express = require('express');
const app = express();

module.exports = function(common) {
  const logger = common.logger('ANP-DASHBOARD');
  function createTcpServer() {
    const controller = {};
    const _info = {
      pid: process.pid,
      server: common.config.embrace.machine_unique_key
    };
    const ctx = {controller, ..._info};
    require('./controller')(common).tcp.call(ctx);
    return net.createServer((socket) => {
      logger.debug(
        `receive new socket from <${socket.remoteAddress}>: ${
          socket.remotePort
        }`
      );
      socket.on('data', common.socket.onData.bind(ctx, socket));
      socket.on('error', (err) => {
        logger.error(`tcp server error`, err);
      });
      socket.on('end', () => {
        common.cache.del(socket.__key__, common.config.cache.socket_list);
        logger.error(`tcp_client socket closed, info is [${socket.__key__}]`);
      });
    });
  }

  function createHttpServer() {
    app.use(require('compression')());
    app.use(require('body-parser').json());
    app.all('*', function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Access-Control-Allow-Methods', '*');
      res.header('Content-Type', 'application/json;charset=utf-8');
      next();
    });
    require('./controller')(common).http(app);
    return app;
  }
  return {
    tcp: createTcpServer(),
    http: createHttpServer()
  };
};
