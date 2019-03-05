'use strict';
const colors = require('colors/safe');
const date = require('./common.date');

colors.setTheme({
  info: 'green',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

const levelMap = {
  nolog: -1,
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

Object.freeze(levelMap);

function template() {
  return `[${date()} ${this.prefix}]`;
}

/**
 * @param {number} level * @param {string} prefix
 * @param prefix
 * @description 日志类构造方法，设置日志级别以及前缀
 */
function Logger(level, prefix) {
  prefix = prefix || '';

  this.setLevel.call(this, level);
  this.prefix = prefix || '';
  this.levelMap = levelMap;
}

/**
 * @param {number | string} level
 * @description 原型方法，设置日志级别
 */
Logger.prototype.setLevel = function(level) {
  if (typeof level !== 'string' && typeof level !== 'number') level = 2;
  if (typeof level === 'string') level = levelMap[level];
  return (this.level = level);
};

/**
 * @param {string} addition
 * @description 原型方法，增加额外日志前缀
 */
Logger.prototype.addPrefix = function(addition) {
  this.prefix = this.prefix + addition;
};

/**
 * @description 原型方法，打印错误级别日志
 */
Logger.prototype.error = function() {
  if (this.level >= levelMap['error']) {
    console.log(colors['error'](template.call(this)), ...arguments);
  }
};

/**
 * @description 原型方法，打印警告级别日志
 */
Logger.prototype.warn = function() {
  if (this.level >= levelMap['warn']) {
    console.log(colors['warn'](template.call(this)), ...arguments);
  }
};

/**
 * @description 原型方法，打印 INFO 级别日志
 */
Logger.prototype.info = function() {
  if (this.level >= levelMap['info']) {
    console.log(colors['info'](template.call(this)), ...arguments);
  }
};

/**
 * @description 原型方法，打印 DEBUG 级别日志
 */
Logger.prototype.debug = function() {
  if (this.level >= levelMap['debug']) {
    console.log(colors['debug'](template.call(this)), ...arguments);
  }
};

exports = module.exports = function(common) {
  return function(name = 'ANP-MONITOR') {
    return new Logger(common.config.logger.level, name);
  };
};
