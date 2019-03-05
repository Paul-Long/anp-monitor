'use strict';

exports = module.exports = function(common) {
  function tcp() {
    require('./tcp.heartbeat')(common).init.call(this);
    require('./tcp.os')(common).init.call(this);
  }

  function http(app) {
    require('./http.overview')(common, app).init();
    require('./http.os')(common, app).init();
  }
  return {tcp, http};
};
