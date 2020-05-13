'use strict';

const assert = require('assert');
const compile = require('../').compile;
const encode = require('../').encode;

describe('test/compile.test.js', () => {

  it('should compile ok', () => {
    const fn = compile({
      $class: 'java.lang.String',
      $: '123',
    }, '2.0', {});
    assert(typeof fn === 'function');
  });

  it('should compile setCache work', () => {
    const cacheObj = { get: () => { throw new Error('mock error'); }, set: () => {} };
    compile.setCache(cacheObj);

    try {
      encode({
        $class: 'java.util.Map',
        $: { foo: 'bar' },
        isMap: true,
      }, '2.0', {}, {}, {});
      assert(false, 'never here');
    } catch (err) {
      assert(err.message === 'mock error');
    }

    // recover
    compile.setCache(new Map());
  });
});
