'use strict';

const defaultValueMap = new Map();
let defaultValueId = 0;

function normalizeGeneric(type) {
  if (!type.generic) return '';
  let str = '';
  for (const item of type.generic) {
    str += '#';
    if (item.isArray) {
      let arrayDepth = item.arrayDepth || 1;
      while (arrayDepth--) str += '[';
    }
    str += (item.type + normalizeGeneric(item));
  }
  return str;
}

function normalizeUniqId(info, version) {
  let type = info.type || info.$class || info.$abstractClass;
  if (info.isArray) {
    let arrayDepth = info.arrayDepth || 1;
    while (arrayDepth--) type = '[' + type;
  }
  let fnKey = type;
  fnKey += normalizeGeneric(info);
  if (info.defaultValue !== undefined) {
    if (!defaultValueMap.has(info.defaultValue)) {
      defaultValueMap.set(info.defaultValue, defaultValueId++);
    }
    fnKey += '#' + defaultValueMap.get(info.defaultValue);
  }
  fnKey += '#' + version;
  return fnKey;
}

exports.normalizeUniqId = normalizeUniqId;

const converts = {
  'java.lang.Boolean': 'Boolean',
  boolean: 'Boolean',
  'java.lang.Integer': 'Number',
  int: 'Number',
  'java.lang.Short': 'Number',
  short: 'Number',
  'java.lang.Double': 'Number',
  double: 'Number',
  'java.lang.Float': 'Number',
  float: 'Number',
};

exports.converts = converts;

exports.normalizeType = type => {
  if (typeof type === 'string') {
    return { type };
  }
  return type;
};

const REG_GETTER = /^function\s+get/g;

exports.getterStringify = fn => {
  return fn.toString().replace(REG_GETTER, 'get');
};

exports.has = function has(obj, prop) {
  // 1. not has property, return false
  // 1. prop val is undefined, return false
  const hasProperty = Object.prototype.hasOwnProperty.call(obj, prop);
  return hasProperty && obj[prop] !== undefined;
};
