const path = require('path');
const embrace = require('./embrace');

module.exports = function(options) {
  options = options || {};
  require('./utils/date');
  const common = require('./common/common')(options).init();
  const logger = common.logger('ANP-MONITOR');
  logger.debug(`start monitor [${process.pid}] `, options);
  embrace(common);
  common.utils.forkNode(path.join(__dirname, 'dashboard/fork.js'), [
    JSON.stringify(options)
  ]);
};
