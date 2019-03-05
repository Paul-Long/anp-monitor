'use strict';

exports = module.exports = function(common) {
  const type = common.config.message.request[2];
  function init() {
    const ctx = this;
    const controller = ctx.controller;
    const _info = {server: ctx.server, pid: ctx.pid};
    controller[type] = function(socket, message) {
      const result = {..._info};
      result.title = common.title;
      result.cpu = common.os.cpu();
      result.memory = common.os.memory();
      result.time = common.date(common.config.date_format[1]);
      common.socket.send(
        socket,
        common.socket.compose(
          common.config.message.type.res,
          3,
          result
        )
      );
    };
  }
  return {init};
};
