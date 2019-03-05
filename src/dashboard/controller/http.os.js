'use strict';

exports = module.exports = function(common, app) {
  const logger = common.logger('ANP-DC-HTTP-OS');
  function notify(data) {
    const key = `${data.server}${common.config.seg}${data.pid}`;
    const socket = common.cache.get(key, common.config.cache.socket_list);
    if (!socket) return false;
    const message = common.socket.compose(
      common.config.message.type.req,
      2,
      {}
    );
    common.socket.send(socket, message);
  }
  function init() {
    function route(req, res) {
      const body = req.body;
      const key = `${body.server}${common.config.seg}${body.pid}`;
      notify(body);
      const result = common.cache.get(key, common.config.cache.os_message);
      if (!result) res.send(common.http.message(3));
      else res.send(common.http.message(0, result));
    }
    app.post(`${common.config.prefix_http}/${common.config.router.os}`, route);
  }
  return {init};
};
