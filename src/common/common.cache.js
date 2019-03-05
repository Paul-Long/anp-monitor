'use strict';
const _storage = {};
module.exports = function(common) {
  const logger = common.logger('ANP-CACHE');
  const _cache = {};

  function set(key, value, type) {
    _storage[type][key] = value;
  }

  function get(key, type) {
    if (type) return _storage[type][key];
    return _storage[key];
  }

  function del(key, type) {
    if (type) {
      delete _storage[type][key];
    } else {
      delete _storage[key];
    }
  }

  function init() {
    _storage[common.config.cache.socket_list] = {};
    _storage[common.config.cache.os_message] = {};
    _cache.set = set;
    _cache.get = get;
    _cache.del = del;
    return _cache;
  }
  return {init};
};
