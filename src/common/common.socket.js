'use strict';

module.exports = function(common) {
  const _socket = {};
  const logger = common.logger('ANP-SOCKET');
  let endSymBuf = null;
  try {
    endSymBuf = Buffer.from(common.config.end_symbol);
  } catch (e) {
    endSymBuf = new Buffer(common.config.end_symbol);
  }

  function compose(type, id, data) {
    const message = {id, data, type};
    if (type === common.config.message.type.req) {
      message.msgType = common.config.message.request[id];
    } else if (type === common.config.message.type.res) {
      message.msgType = common.config.message.response[id];
    }
    return message;
  }

  async function send(client, message) {
    message = typeof message === 'object' ? JSON.stringify(message) : message;
    const compressBuffer = await common.utils.compress(message);
    const newBuf = Buffer.concat(
      [compressBuffer, endSymBuf],
      compressBuffer.length + endSymBuf.length
    );
    client.write(newBuf);
  }

  function onData(socket, message) {
    const ctx = this;
    const controller = ctx.controller;
    let msg = common.utils.parse(message);
    msg = common.utils.jsonParse(msg);
    const ctrlKey = msg.msgType;
    if (controller[ctrlKey]) {
      const fn = controller[ctrlKey];
      if (typeof fn === 'function') {
        fn(socket, msg.data);
      }
    }
  }

  function init() {
    _socket.send = send;
    _socket.onData = onData;
    _socket.compose = compose;
    return _socket;
  }

  return {init};
};
