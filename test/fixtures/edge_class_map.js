'use strict';

const Enums = require('enums');

module.exports = {
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
  'org.sofa.TestObjectD': {
    list: {
      type: 'java.util.List',
      generic: [
        { type: 'java.lang.Object' },
      ],
    },
  },

  'org.sofa.TestObjectE': {
    info: {
      type: 'java.util.Map',
      generic: [
        { type: 'java.lang.String' },
        { type: 'java.util.List', generic: [{ type: 'java.lang.Object' }] },
      ],
    },
  },
  'org.sofa.ArrayGeneric': {
    info: {
      type: 'java.util.Map',
      generic: [
        { type: 'java.lang.String' },
        { type: 'java.lang.String', isArray: true, },
      ],
    },
  },
  'org.sofa.ArrayDepthGeneric': {
    info: {
      type: 'java.util.Map',
      generic: [
        { type: 'java.lang.String' },
        { type: 'java.lang.String', isArray: true, arrayDepth: 2},
      ],
    },
  },
  'org.sofa.NoArrayGeneric': {
    info: {
      type: 'java.util.Map',
      generic: [
        { type: 'java.lang.String' },
        { type: 'java.lang.String' },
      ],
    },
  },
  'org.sofa.RecursiveArrayGeneric': {
    info: {
      type: 'java.util.Map',
      generic: [
        { type: 'java.lang.String' },
        {
          type: 'java.util.Map',
          generic: [
            { type: 'java.lang.String' },
            { type: 'java.lang.String', isArray: true, },
          ],
        }
      ],
    },
  },
  'org.sofa.RecursiveNoArrayGeneric': {
    info: {
      type: 'java.util.Map',
      generic: [
        { type: 'java.lang.String' },
        {
          type: 'java.util.Map',
          generic: [
            { type: 'java.lang.String' },
            { type: 'java.lang.String' },
          ],
        }
      ],
    },
  },

  'org.sofa.TestObjectF': {
    enum: {
      type: 'org.sofa.enums.TestTypeEnum',
      isEnum: true,
    },
    string: {
      type: 'java.lang.String',
    },
    bool: {
      type: 'bool',
    },
    boolean: {
      type: 'java.lang.Boolean',
    },
    int: {
      type: 'int',
    },
    integer: {
      type: 'java.lang.Integer',
    },
    long: {
      type: 'long',
    },
    long2: {
      type: 'java.lang.Long',
    },
    double: {
      type: 'double',
    },
    double2: {
      type: 'java.lang.Double',
    },
    map: {
      type: 'java.util.Map',
    },
    list: {
      type: 'java.util.List',
    },
    arrayList: {
      type: 'java.util.ArrayList',
    },
    date: {
      type: 'java.util.Date',
    },
    clazz: {
      type: 'java.lang.Class',
    },
    currency: {
      type: 'java.util.Currency',
    },
    bigdecimal: {
      type: 'java.math.BigDecimal',
    },
    locale: {
      type: 'java.util.Locale',
    },
  },
  'com.test.model.datum.DatumStaus': new Enums([
    { $name: 'PRERELEASING', name: 'PRERELEASING' },
  ]),
  'com.test.model.datum.DatumStaus2': new Enums([
    { $name: 'PRERELEASING', name: 'TEST_NAME' },
  ]),
};
