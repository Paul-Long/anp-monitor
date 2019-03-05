'use strict';

exports = module.exports = function(options) {
  let prefix = '';
  let port_http = 13333;
  if (Object.prototype.hasOwnProperty.call(options, 'prefix_http')) {
    prefix = options.prefix_http;
  }
  if (Object.prototype.hasOwnProperty.call(options, 'port_http')) {
    port_http = options.port_http;
  }
  return {
    port_http,

    host_http: '127.0.0.1',

    prefix_http: prefix,

    port_tcp: 26666,

    host_tcp: '127.0.0.1',

    end_symbol: '!&@#$%\r\n',

    seg: '::',

    tcp_heartbeat: 60 * 1000,

    fork_restart: 'fork_node_restart',

    logger: require('./config.logger')(options),

    cache: require('./config.cache'),

    socket: require('./config.socket'),

    embrace: require('./config.embrace'),

    message: require('./config.message'),

    router: require('./config.router'),

    date_format: require('./config.format'),

    http: require('./config.http')
  };
};
