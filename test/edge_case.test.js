'use strict';

const assert = require('assert');
const encode = require('../').encode;
const hessian = require('hessian.js-1');

describe('test/edge_case.test.js', () => {
  const classMap = {
    'org.sofa.TestObjectA': {
      size: {
        type: 'int',
        defaultValue: 10,
      },
    },
    'org.sofa.TestObjectB': {
      size: {
        type: 'int',
        defaultValue: 1,
      },
    },
    'org.sofa.TestObjectC': {
      size: {
        type: 'int',
        defaultValue: 10,
      },
    },
  };

  [
    '1.0',
    '2.0',
  ].forEach(version => {
    it('should defaultValue encode well', () => {
      const a = {
        $class: 'org.sofa.TestObjectA',
        $: {},
      };
      const bufA = encode(a, version, classMap);
      assert.deepEqual(hessian.decode(bufA, version), { size: 10 });

      const b = {
        $class: 'org.sofa.TestObjectB',
        $: {},
      };
      const bufB = encode(b, version, classMap);
      assert.deepEqual(hessian.decode(bufB, version), { size: 1 });

      const c = {
        $class: 'org.sofa.TestObjectC',
        $: {},
      };
      const bufC = encode(c, version, classMap);
      assert.deepEqual(hessian.decode(bufC, version), { size: 10 });
    });
  });
});
