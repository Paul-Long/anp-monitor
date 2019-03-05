'use strict';

exports = module.exports = function(common) {
  const logger = common.logger('ANP-DC-TCP-OS');
  const type = common.config.message.response[3];
  function init() {
    const controller = this.controller;
    controller[type] = function(socket, message) {
      const key = `${message.server}${common.config.seg}${message.pid}`;
      common.cache.set(key, message, common.config.cache.os_message);
    };
  }
  return {init};
};
