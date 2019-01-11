'use strict';

const assert = require('assert');
const compile = require('../').compile;

describe('test/compile.test.js', () => {

  it('should compile ok', () => {
    const fn = compile({
      $class: 'java.lang.String',
      $: '123',
    }, '2.0', {});
    assert(typeof fn === 'function');
  });
});
