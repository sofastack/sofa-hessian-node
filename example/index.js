'use strict';

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

const encode = require('..').encode;

const buf = encode({
  $class: 'com.alipay.test.sub.TestObj2',
  $: { name: 'gxcsoccer' },
}, '2.0', classMap);

console.log(buf.toString('hex'));
// 4fac636f6d2e616c697061792e746573742e7375622e546573744f626a3292046e616d650a66696e616c4669656c646f9009677863736f6363657203787878
