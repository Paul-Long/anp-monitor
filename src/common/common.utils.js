'use strict';
const path = require('path');
const zlib = require('zlib');
const glob = require('glob');
const child_process = require('child_process');
const EventEmitter = require('events').EventEmitter;
const event = new EventEmitter();

exports = module.exports = function(common) {
  const logger = common.logger('ANP-COMMON-UTILS');

  function forkNode(forkPath, argv) {
    const cp = child_process.fork(forkPath, argv, {
      silent: false,
      execArgv: []
    });
    cp.on('exit', (signal) => {
      if (signal === 0) {
        logger.info(`child_process [${process.pid}] exit with code ${signal}`);
      } else {
        logger.error(`child_process [${process.pid}] exit with code ${signal}`);
      }
      cp.kill();
    });
    event.on(common.config.fork_restart, forkNode.bind(forkPath, argv));
  }

  function jsonParse(str) {
    let result = {};
    if (!str) return result;
    try {
      result = JSON.parse(str);
    } catch (e) {
      logger.error(`common.utils->jsonParse error: ${e}, raw str is: ${str}`);
    }
    return result;
  }

  function getFileList(base, files) {
    return glob
      .sync(files, {
        cwd: base
      })
      .map((file) => {
        return path.join(base, file);
      });
  }

  function compress(msg) {
    return new Promise((resolve, reject) => {
      zlib.deflate(msg, (err, buffer) => {
        if (err) return reject(err);
        return resolve(buffer);
      });
    });
  }

  function parse(msg) {
    msg = (Buffer.isBuffer(msg) && msg) || Buffer.from(msg);
    msg = zlib.inflateSync(msg);
    return String(msg);
  }

  function init() {
    return {
      event,
      compress,
      forkNode,
      jsonParse,
      getFileList,
      parse
    };
  }

  return {init};
};
