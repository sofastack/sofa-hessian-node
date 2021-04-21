'use strict';

const assert = require('assert');
const utils = require('../lib/utils');

describe('test/util.test.js', () => {
  it('should handle generic', () => {
    const info = {
      $class: 'java.util.List',
      $: [],
      generic: [{
        type: 'java.util.List',
        generic: [{ type: 'com.sofa.testObject' }],
      }],
    };
    let id = utils.normalizeUniqId(info, '2.0');
    assert(id === 'java.util.List#java.util.List#com.sofa.testObject#2.0');
    id = utils.normalizeUniqId(info, '1.0');
    assert(id === 'java.util.List#java.util.List#com.sofa.testObject#1.0');
  });

  it('should handle type is object', () => {
    const info = {
      isArray: true,
      type: {
        type: 'com.sofa.testObject',
      },
    };
    const id = utils.normalizeUniqId(info, '2.0');
    assert(id === '[com.sofa.testObject#2.0');

    const info2 = {
      isArray: true,
      type: {
        type: 'com.sofa.testObject',
        generic: [
          { type: 'java.lang.String' },
        ],
      },
    };
    const id2 = utils.normalizeUniqId(info2, '2.0');
    assert(id2 === '[com.sofa.testObject#java.lang.String#2.0');
  });
});
