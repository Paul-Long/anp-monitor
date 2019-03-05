<p align="center">
  <a href="https://github.com/Paul-Long/fast-table">
    <img width="200" src="http://houym-1254119810.picsh.myqcloud.com/logo-200_150.png">
  </a>
</p>

<h1 align="center">Anp-Monitor</h1>

<div align="center">

analytics node profiler monitor

[![npm package](https://img.shields.io/npm/v/anp-monitor.svg?style=flat)](https://www.npmjs.com/package/anp-monitor)
[![NPM downloads](http://img.shields.io/npm/dm/anp-monitor.svg?style=flat-square)](http://npmjs.com/anp-monitor)
[![Dependencies](https://img.shields.io/david/paul-long/anp-monitor.svg?style=flat-square)](https://david-dm.org/paul-long/anp-monitor)
[![DevDependencies](https://img.shields.io/david/dev/paul-long/anp-monitor.svg?style=flat-square)](https://david-dm.org/paul-long/anp-monitor?type=dev)
[![Gitter](https://img.shields.io/gitter/room/paul-long/anp-monitor.svg?style=flat-square)](https://gitter.im/paul-long/paul-long?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Codecov](https://img.shields.io/coveralls/github/paul-long/anp-monitor.svg?style=flat-square)](https://codecov.io/gh/paul-long/anp-monitor/branch/master)
[![Issues need help](https://flat.badgen.net/github/label-issues/paul-long/anp-monitor/help%20wanted/open)](https://github.com/paul-long/anp-monitor/issues?q=label%3A%22help+wanted%22)

</div>

# 安装

[![rc-select](https://nodei.co/npm/anp-monitor.png)](https://npmjs.org/package/anp-monitor)

```bash
npm install anp-monitor --save-dev
```

# 使用

```javascript
const monitor = require('anp-monitor');
monitor({
  title: 'Anp-Monitor',
  level: 2,
  prefix_http: '/monitor-prefix',
  port_http: 13333
});
```

# options

| option      | describe      | type   | default value |
| ----------- | ------------- | ------ | ------------- |
| title       | 显示名        | String |               |
| level       | logger level  | Number |               |
| prefix_http | http 请求前缀 | String |               |
| port_http   | http port     | Number | 13333         |
