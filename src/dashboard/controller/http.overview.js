'use strict';

exports = module.exports = function(common, app) {
  function init() {
    function route(req, res) {
      const socketList = common.cache.get(common.config.cache.socket_list);
      const result = {};
      Object.keys(socketList).forEach((item) => {
        const arr = item.split(common.config.seg);
        if (!result[arr[0]]) {
          result[arr[0]] = [];
        }
        result[arr[0]].push(arr[1]);
      });
      res.send(JSON.stringify(result));
    }
    app.get(
      `${common.config.prefix_http}/${common.config.router.overview}`,
      route
    );
  }
  return {init};
};
