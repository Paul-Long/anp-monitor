'use strict';

exports = module.exports = function(common) {
  const type = common.config.message.request[0];
  function init() {
    const controller = this.controller;
    controller[type] = function(socket, message) {
      const key = `${message.server}${common.config.seg}${message.pid}`;
      common.cache.set(key, socket, common.config.cache.socket_list);
      socket.__key__ = key;
    };
  }
  return {init};
};
