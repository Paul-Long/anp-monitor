'use strict';

exports = module.exports = function(common) {
  function message(code, msg) {
    const message = {success: true, code};
    if (Number(code) !== 0) {
      message.success = false;
      message.error = common.config.http[code] || '未知错误';
    }
    message.data = msg;
    return JSON.stringify(message);
  }
  return {message};
};
