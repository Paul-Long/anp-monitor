'use strict';

const userConfig = JSON.parse(process.argv[2]);

const common = require('../common/common')(userConfig).base();
const logger = common.logger('ANP-SERVER');
const dashboard = require('./index')(common);
const httpServer = dashboard.http.listen(common.config.port_http, function() {
  logger.info(
    `http_server [${process.pid}] start http://localhost:${
      common.config.port_http
    }`
  );
});
httpServer.on('error', function(err) {
  logger.info(
    `http server has been started, this [${process.pid}] will be closed ...`
  );
  httpServer.close();
  process.exit(0);
});

const tcpServer = dashboard.tcp.listen(common.config.port_tcp, function() {
  logger.info(
    `tcp_server [${process.pid}] start http://localhost:${
      common.config.port_tcp
    }`
  );
});

tcpServer.on('error', function() {
  logger.info(
    `tcp server has been started, this [${process.pid}] will be closed`
  );
});
