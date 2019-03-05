'use strict';
const os = require('os');

module.exports = function(common) {
  const _os = {};
  const logger = common.logger('ANP-COMMON-SYSTEM');
  function cpu() {
    //综合统计信息保存
    const cpuUsage = os.cpus();
    const statics = {user: 0, sys: 0, idle: 0, all: 0};

    //获取所有的 user，sys 和 idle 的 cpu 时间片
    cpuUsage.forEach((c) => {
      const times = c.times;
      const user = Number(times.user);
      const nice = Number(times.nice);
      const sys = Number(times.sys);
      const idle = Number(times.idle);
      const irq = Number(times.irq);

      //进行计数统计
      statics.user = statics.user + user;
      statics.sys = statics.sys + sys;
      statics.idle = statics.idle + idle;
      statics.all = statics.all + user + nice + sys + idle + irq;
    });

    //返回各部分占比
    return {
      user: statics.user / statics.all,
      sys: statics.sys / statics.all,
      idle: statics.idle / statics.all
    };
  }

  function memory() {
    return process.memoryUsage();
  }

  function init() {
    _os.cpu = cpu;
    _os.memory = memory;
    return _os;
  }

  return {init};
};
