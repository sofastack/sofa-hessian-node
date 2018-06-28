'use strict';

const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');
const suite = new Benchmark.Suite();

const assert = require('assert');
const hessian = require('hessian.js-1');
const protocol = require('../');
const classMap = require('../test/fixtures/class_map');

const obj = {
  $class: 'com.alipay.test.TestObj',
  $: {
    b: true,
    name: 'testname',
    field: 'xxxxx',
    testObj2: { name: 'xxx', finalField: 'xxx' },
    testEnum: { name: 'B' },
    testEnum2: [{ name: 'B' }, { name: 'C' }],
    bs: new Buffer([ 0x02, 0x00, 0x01, 0x07 ]),
    list1: [{ name: 'A' }, { name: 'B' }],
    list2: [ 2017, 2016 ],
    list3: [{ name: 'aaa', finalField: 'xxx' },
      { name: 'bbb', finalField: 'xxx' },
    ],
    list4: [ 'xxx', 'yyy' ],
    list5: [ new Buffer([ 0x02, 0x00, 0x01, 0x07 ]), new Buffer([ 0x02, 0x00, 0x01, 0x06 ]) ],
    map1: { 2017: { name: 'B' } },
    map2: new Map([
      [ 2107, 2016 ],
    ]),
    map3: {},
    map4: { xxx: 'yyy' },
    map5: { 2017: new Buffer([ 0x02, 0x00, 0x01, 0x06 ]) },
  },
};

const targetObj = {
  $class: 'com.alipay.test.TestObj',
  $: {
    b: { $class: 'boolean', $: true },
    testObj2: { $class: 'com.alipay.test.sub.TestObj2', $: { name: { $class: 'java.lang.String', $: 'xxx' }, finalField: { $class: 'java.lang.String', $: 'xxx' } } },
    name: { $class: 'java.lang.String', $: 'testname' },
    field: { $class: 'java.lang.String', $: 'xxxxx' },
    testEnum: { $class: 'com.alipay.test.TestEnum', $: { name: 'B' } },
    testEnum2: {
      $class: '[com.alipay.test.TestEnum',
      $: [
        { $class: 'com.alipay.test.TestEnum', $: { name: 'B' } },
        { $class: 'com.alipay.test.TestEnum', $: { name: 'C' } },
      ],
    },
    bs: new Buffer([ 0x02, 0x00, 0x01, 0x07 ]),
    list1: {
      $class: 'java.util.List',
      $: [
        { $class: 'com.alipay.test.TestEnum', $: { name: 'A' } }, { $class: 'com.alipay.test.TestEnum', $: { name: 'B' } },
      ],
    },
    list2: {
      $class: 'java.util.List',
      $: [
        { $class: 'java.lang.Integer', $: 2017 }, { $class: 'java.lang.Integer', $: 2016 },
      ],
    },
    list3: {
      $class: 'java.util.List',
      $: [
        { $class: 'com.alipay.test.sub.TestObj2', $: { name: { $class: 'java.lang.String', $: 'aaa' }, finalField: { $class: 'java.lang.String', $: 'xxx' } } }, { $class: 'com.alipay.test.sub.TestObj2', $: { name: { $class: 'java.lang.String', $: 'bbb' }, finalField: { $class: 'java.lang.String', $: 'xxx' } } },
      ],
    },
    list4: {
      $class: 'java.util.List',
      $: [
        { $class: 'java.lang.String', $: 'xxx' }, { $class: 'java.lang.String', $: 'yyy' },
      ],
    },
    list5: {
      $class: 'java.util.List',
      $: [ new Buffer([ 0x02, 0x00, 0x01, 0x07 ]), new Buffer([ 0x02, 0x00, 0x01, 0x06 ]) ],
    },
    map1: {
      $class: 'java.util.Map',
      $: new Map([
        [{ $class: 'java.lang.Long', $: 2017 }, {
          $class: 'com.alipay.test.TestEnum',
          $: { name: 'B' },
        }],
      ]),
    },
    map2: {
      $class: 'java.util.Map',
      $: new Map([
        [{ $class: 'java.lang.Integer', $: 2107 }, { $class: 'java.lang.Integer', $: 2016 }],
      ]),
    },
    map3: { $class: 'java.util.Map', $: {} },
    map4: { $class: 'java.util.Map', $: { xxx: { $class: 'java.lang.String', $: 'yyy' } } },
    map5: {
      $class: 'java.util.Map',
      $: new Map([
        [ '2017', new Buffer([ 0x02, 0x00, 0x01, 0x06 ]) ],
      ]),
    },
  },
};

let buf1 = hessian.encode(targetObj, '1.0');
let buf2 = protocol.encode(obj, '1.0', classMap);
assert.deepEqual(buf1, buf2);

buf1 = hessian.encode(targetObj, '2.0');
buf2 = protocol.encode(obj, '2.0', classMap);
assert.deepEqual(buf1, buf2);

// add tests
suite
  .add('hessian old - 1.0', function() {
    hessian.encode(targetObj, '1.0');
  })
  .add('hessian new - 1.0', function() {
    protocol.encode({
      $class: 'com.alipay.test.TestObj',
      $: obj,
    }, '1.0', classMap);
  })
  .add('hessian old - 2.0', function() {
    hessian.encode(targetObj, '2.0');
  })
  .add('hessian new - 2.0', function() {
    protocol.encode({
      $class: 'com.alipay.test.TestObj',
      $: obj,
    }, '2.0', classMap);
  })
  .on('cycle', function(event) {
    benchmarks.add(event.target);
  })
  .on('start', function() {
    console.log('\n  node version: %s, date: %s\n  Starting...', process.version, Date());
  })
  .on('complete', function done() {
    benchmarks.log();
  })
  .run({ async: false });
