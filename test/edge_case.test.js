'use strict';

const assert = require('assert');
const encode = require('../').encode;
const hessian = require('hessian.js-1');
const sleep = require('mz-modules/sleep');
const classMap = require('./fixtures/edge_class_map');

describe('test/edge_case.test.js', () => {
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

    it('support list property with $class & $', () => {
      const obj1 = {
        $class: 'org.sofa.TestObjectD',
        $: {
          list: [{
            $class: 'java.lang.String',
            $: '123',
          }],
        },
      };
      const buf1 = encode(obj1, version, classMap);

      const obj2 = {
        $class: 'org.sofa.TestObjectD',
        $: {
          list: {
            $class: 'java.util.List',
            $: [{
              $class: 'java.lang.String',
              $: '123',
            }],
          },
        },
      };
      const buf2 = encode(obj2, version, classMap);

      assert.deepEqual(buf1, buf2);
    });

    it('generic list with array type', () => {
      const obj1 = {
        $class: 'org.sofa.TestObjectE',
        $: {
          info: {
            xxxx: {
              $class: 'java.util.List',
              $: [{
                $class: 'java.lang.String',
                $: [ '11', '22' ],
                isArray: true,
              }],
            },
          },
        },
      };
      const buf = encode(obj1, version, classMap);
      console.log(buf);
    });

    it('should be compatible with property with $class/$', () => {
      const obj = {
        $class: 'org.sofa.TestObjectF',
        $: {
          enum: {
            $class: 'org.sofa.enums.TestTypeEnum',
            $: {
              name: 'AAA',
            },
          },
          string: {
            $class: 'java.lang.String',
            $: '123',
          },
          bool: {
            $class: 'bool',
            $: false,
          },
          boolean: {
            $class: 'java.lang.Boolean',
            $: false,
          },
          int: {
            $class: 'int',
            $: 123,
          },
          integer: {
            $class: 'java.lang.Integer',
            $: 123,
          },
          long: {
            $class: 'long',
            $: 100000,
          },
          long2: {
            $class: 'java.lang.Long',
            $: 100000,
          },
          double: {
            $class: 'double',
            $: 1.2,
          },
          double2: {
            $class: 'java.lang.Double',
            $: 1.2,
          },
          map: {
            $class: 'java.util.Map',
            $: {
              a: 'a',
            },
          },
          list: {
            $class: 'java.util.List',
            $: [ 1 ],
          },
          arraylist: {
            $class: 'java.util.ArrayList',
            $: [ 123 ],
          },
          date: {
            $class: 'java.util.Date',
            $: 1471096717898,
          },
          clazz: {
            $class: 'java.lang.Class',
            $: {
              name: '[java.lang.String',
            },
          },
          currency: {
            $class: 'java.util.Currency',
            $: 'CNY',
          },
          bigdecimal: {
            $class: 'java.math.BigDecimal',
            $: { value: '100.06' },
          },
          locale: {
            $class: 'java.util.Locale',
            $: 'zh_CN',
          },
        },
      };
      const buf = encode(obj, version, classMap);
      const res = hessian.decode(buf, version);
      assert.deepEqual(res, {
        enum: { name: 'AAA' },
        string: '123',
        bool: false,
        boolean: false,
        int: 123,
        integer: 123,
        long: 100000,
        long2: 100000,
        double: 1.2,
        double2: 1.2,
        map: { a: 'a' },
        list: [ 1 ],
        arrayList: null,
        date: new Date(1471096717898),
        clazz: { name: '[java.lang.String' },
        currency: { currencyCode: 'CNY' },
        bigdecimal: { value: '100.06' },
        locale: { value: 'zh_CN' },
      });
    });

    it('should validate enum name', () => {
      const obj = {
        $class: 'com.test.model.datum.DatumStaus',
        $: {
          name: 'PRERELEASING_INVALIDATE',
        },
        isEnum: true,
      };
      let error;
      try {
        encode(obj, version, classMap);
      } catch (e) {
        error = e;
      } finally {
        assert(error);
        assert(error.message === 'enum: com.test.model.datum.DatumStaus have no name: ["PRERELEASING_INVALIDATE"]');
      }
    });

    it('enum name not equal $name', () => {
      const obj = {
        $class: 'com.test.model.datum.DatumStaus2',
        $: {
          name: 'PRERELEASING',
        },
        isEnum: true,
      };
      const buf = encode(obj, version, classMap);
      const res = hessian.decode(buf, version);
      assert.deepStrictEqual(res, { name: 'PRERELEASING' });
    });

    it('should support getter defaultValue', async () => {
      const classMap = {
        'com.test.TestClass': {
          bizTime: {
            type: 'java.util.Date',
            get defaultValue() {
              return new Date();
            },
          },
          a: {
            type: 'com.test.TestClass2',
          },
        },
        'com.test.TestClass2': {
          bizTime: {
            type: 'java.util.Date',
            get defaultValue() {
              return new Date();
            },
          },
        },
      };
      const obj = {
        $class: 'com.test.TestClass',
        $: { a: {} },
      };
      const buf1 = encode(obj, version, classMap);
      const res1 = hessian.decode(buf1, version);
      assert(res1.bizTime instanceof Date);
      assert(res1.a && res1.a.bizTime instanceof Date);
      console.log(res1);

      await sleep(1000);

      const buf2 = encode(obj, version, classMap);
      const res2 = hessian.decode(buf2, version);
      assert(res2.bizTime instanceof Date);
      assert(res2.a && res2.a.bizTime instanceof Date);
      console.log(res2);

      assert(res2.bizTime.getTime() - res1.bizTime.getTime() >= 1000);
      assert(res2.a.bizTime.getTime() - res1.a.bizTime.getTime() >= 1000);

      const obj2 = {
        $class: 'com.test.TestClass',
        $: {
          bizTime: null,
          a: {
            bizTime: null,
          },
        },
      };
      const buf3 = encode(obj2, version, classMap);
      const res3 = hessian.decode(buf3, version);
      assert(res3.bizTime == null);
      assert(res3.a && res3.a.bizTime == null);

      const objUndefined = {
        $class: 'com.test.TestClass',
        $: {
          bizTime: undefined,
          a: {
            bizTime: undefined,
          },
        },
      };
      const resUndefined = hessian.decode(encode(objUndefined, version, classMap), version);
      assert(resUndefined.bizTime);
      assert(resUndefined.a && resUndefined.a.bizTime);
    });

    it('array generic type should work', () => {
      const obj = {
        $class: 'org.sofa.ArrayGeneric',
        $: {
          info: {
            test: [ 'test' ],
          },
        },
      };
      const bufA = encode(obj, version, classMap);
      assert.deepEqual(hessian.decode(bufA, version), {
        info: {
          test: [ 'test' ],
        },
      });

      const obj2 = {
        $class: 'org.sofa.NoArrayGeneric',
        $: {
          info: {
            test: 'test',
          },
        },
      };
      const bufB = encode(obj2, version, classMap);
      assert.deepEqual(hessian.decode(bufB, version), {
        info: {
          test: 'test',
        },
      });

      const obj3 = {
        $class: 'org.sofa.ArrayDepthGeneric',
        $: {
          info: {
            test: [[ 'test' ]],
          },
        },
      };
      const bufC = encode(obj3, version, classMap);
      assert.deepEqual(hessian.decode(bufC, version), {
        info: {
          test: [[ 'test' ]],
        },
      });
    });

    it('recursive array generic type should work', () => {
      const obj = {
        $class: 'org.sofa.RecursiveArrayGeneric',
        $: {
          info: {
            test: {
              test: [ 'test' ],
            },
          },
        },
      };
      const bufA = encode(obj, version, classMap);
      assert.deepEqual(hessian.decode(bufA, version), {
        info: {
          test: {
            test: [ 'test' ],
          },
        },
      });

      const obj2 = {
        $class: 'org.sofa.RecursiveNoArrayGeneric',
        $: {
          info: {
            test: {
              test: 'test',
            },
          },
        },
      };
      const bufB = encode(obj2, version, classMap);
      assert.deepEqual(hessian.decode(bufB, version), {
        info: {
          test: {
            test: 'test',
          },
        },
      });
    });

    it('should work with set', () => {
      const a = {
        $class: 'com.test.foo.SetProperty',
        $: {
          setProperty: new Set([ 233, 23333 ]),
        },
      };
      const bufA = encode(a, version, classMap);
      const decodeObj = hessian.decode(bufA, version);
      assert.deepStrictEqual(decodeObj, {
        setProperty: [ '233', '23333' ],
      });
    });

    it('java.lang.Object pass java.util.Map type', () => {
      const a = {
        $class: 'java.lang.Object',
        $: {
          $class: 'java.util.Map',
          $: {
            a: 'a',
          },
        },
      };
      const buf = encode(a, version, {});

      const buf1 = hessian.encode({
        $class: 'java.util.Map',
        $: {
          a: 'a',
        },
      }, version);

      assert.deepStrictEqual(buf, buf1);
    });

    it('custom class pass java.lang.Class primitive type', () => {
      const a = {
        $class: 'com.test.aaa',
        $: {
          $class: 'java.lang.Class',
          $: {
            name: 'a',
          },
        },
      };
      const buf = encode(a, version, {
        'com.test.aaa': {},
      });

      const buf1 = hessian.encode({
        $class: 'java.lang.Class',
        $: {
          name: 'a',
        },
      }, version);

      assert.deepStrictEqual(buf, buf1);
    });

    it('java.lang.Object pass java.util.List type', () => {
      const a = {
        $class: 'java.lang.Object',
        $: {
          $class: 'java.util.List',
          $: [ '1' ],
        },
      };
      const buf = encode(a, version, {});

      const buf1 = hessian.encode({
        $class: 'java.util.List',
        $: [ '1' ],
      }, version);

      assert.deepStrictEqual(buf, buf1);
    });

    it('java.lang.Object pass java.util.Set type', () => {
      const a = {
        $class: 'java.lang.Object',
        $: {
          $class: 'java.util.Set',
          $: [ '1' ],
        },
      };
      const buf = encode(a, version, {});

      const buf1 = hessian.encode({
        $class: 'java.util.Set',
        $: [ '1' ],
      }, version);

      assert.deepStrictEqual(buf, buf1);
    });

  });
});
