'use strict';

exports = module.exports = function(common) {
  function tcp() {
    require('./tcp.os')(common).init.call(this);
  }
  return {tcp};
};
