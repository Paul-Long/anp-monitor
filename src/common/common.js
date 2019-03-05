'use strict';

exports = module.exports = function(options) {
  const _common = {};
  options = options || {};
  const isObject = typeof options === 'object';
  _common.title = isObject ? options.title : options;
  _common.date = require('./common.date');
  _common.config = require('../config/config')(isObject ? options : {});
  _common.logger = require('./common.logger')(_common);
  _common.utils = require('./common.utils')(_common).init();
  _common.socket = require('./common.socket')(_common).init();
  _common.os = require('./common.os')(_common).init();
  _common.http = require('./common.http')(_common);
  function init() {
    // _common.profiler = require('./common.profiler')(_common).init();
    return _common;
  }
  function base() {
    _common.cache = require('./common.cache')(_common).init();
    return _common;
  }
  return {base, init};
};
