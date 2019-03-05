'use strict';
exports = module.exports = function(options) {
  let level = 3;
  if (Object.prototype.hasOwnProperty.call(options, 'level')) {
    level = options.level;
  }
  return {
    level
  };
};
