# sofa-hessian-node
蚂蚁金服对 Hessian 序列化的定制版本

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/sofa-hessian-node.svg?style=flat-square
[npm-url]: https://npmjs.org/package/sofa-hessian-node
[travis-image]: https://img.shields.io/travis/alipay/sofa-hessian-node.svg?style=flat-square
[travis-url]: https://travis-ci.org/alipay/sofa-hessian-node
[codecov-image]: https://codecov.io/gh/alipay/sofa-hessian-node/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/alipay/sofa-hessian-node
[david-image]: https://img.shields.io/david/alipay/sofa-hessian-node.svg?style=flat-square
[david-url]: https://david-dm.org/alipay/sofa-hessian-node
[snyk-image]: https://snyk.io/test/npm/sofa-hessian-node/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/sofa-hessian-node
[download-image]: https://img.shields.io/npm/dm/sofa-hessian-node.svg?style=flat-square
[download-url]: https://npmjs.org/package/sofa-hessian-node

sofa-hessian-node 对应的 Java Hessian 版本是 v3.1.3。它对 [hessian.js-1](https://www.npmjs.org/package/hessian.js-1) 模块做了进一步封装，通过预编译来提高性能。

## 安装

```bash
$ npm install sofa-hessian-node --save
```

## 示例

```js
'use strict';

// classMap 是要序列化类的定义
const classMap = {
  'com.alipay.test.sub.TestObj2': {
    name: {
      type: 'java.lang.String',
    },
    transientField: {
      type: 'java.lang.String',
      isTransient: true,
    },
    finalField: {
      type: 'java.lang.String',
      defaultValue: 'xxx',
    },
    staticField: {
      type: 'java.lang.String',
      isStatic: true,
    },
  },
};

const encode = require('sofa-hessian-node').encode;

const buf = encode({
  $class: 'com.alipay.test.sub.TestObj2',
  $: { name: 'gxcsoccer' },
}, '2.0', classMap);

console.log(buf.toString('hex'));
// 4fac636f6d2e616c697061792e746573742e7375622e546573744f626a3292046e616d650a66696e616c4669656c646f9009677863736f6363657203787878
```

## hessian 4 支持

```js
const { v4 } = require('sofa-hessian-node');

const buf = v4.encode({
  $class: 'com.alipay.test.sub.TestObj2',
  $: { name: 'gxcsoccer' },
}, '2.0', classMap);

console.log(buf.toString('hex'));
```

## 性能数据

从 [benchmark](benchmark/index.js) 看，相比于直接使用 hessian.js-1，sofa-hessian-node 性能有非常明显的提高（特别是针对复杂对象的场景）

```bash
  node version: v10.0.0, date: Wed Jun 27 2018 23:17:47 GMT+0800 (CST)
  Starting...
  4 tests completed.

  hessian old - 1.0 x  47,719 ops/sec ±2.57% (86 runs sampled)
  hessian new - 1.0 x 246,812 ops/sec ±2.76% (87 runs sampled)
  hessian old - 2.0 x  78,132 ops/sec ±2.49% (84 runs sampled)
  hessian new - 2.0 x 372,090 ops/sec ±2.99% (87 runs sampled)
```

## 如何贡献

请告知我们可以为你做些什么，不过在此之前，请检查一下是否有已经[存在的Bug或者意见](https://github.com/alipay/sofa-hessian-node/issues)。

如果你是一个代码贡献者，请参考[代码贡献规范](https://github.com/eggjs/egg/blob/master/CONTRIBUTING.zh-CN.md)。

## 开源协议

[MIT](LICENSE)
