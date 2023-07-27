'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const utils = require('../utils');
const has = require('utility').has;
const codegen = require('@protobufjs/codegen');
const classMapCacheOn = Symbol('classMapCacheOn');

let cache = new Map();
const typeMap = {
  bool: require('../primitive_type/boolean'),
  boolean: require('../primitive_type/boolean'),
  'java.lang.Boolean': require('../primitive_type/java.lang.boolean'),
  int: require('../primitive_type/int'),
  'java.lang.Integer': require('../primitive_type/java.lang.integer'),
  short: require('../primitive_type/int'),
  'java.lang.Short': require('../primitive_type/java.lang.integer'),
  long: require('../primitive_type/long'),
  'java.lang.Long': require('../primitive_type/java.lang.long'),
  double: require('../primitive_type/double'),
  'java.lang.Double': require('../primitive_type/java.lang.double'),
  float: require('../primitive_type/double'),
  'java.lang.Float': require('../primitive_type/java.lang.double'),
  byte: require('../primitive_type/int'),
  'java.lang.Byte': require('../primitive_type/java.lang.integer'),
  char: require('../primitive_type/java.lang.string'),
  'java.lang.Character': require('../primitive_type/java.lang.string'),
  'java.lang.String': require('../primitive_type/java.lang.string'),
  'java.util.Map': require('../primitive_type/java.util.map'),
  'java.util.HashMap': require('../primitive_type/java.util.map'),
  'java.util.List': require('../primitive_type/java.util.list'),
  'java.util.Set': require('../primitive_type/java.util.set'),
  'java.util.Collection': require('../primitive_type/java.util.list'),
  'java.util.ArrayList': require('../primitive_type/java.util.arraylist'),
  'java.util.Date': require('../primitive_type/java.util.date'),
  'java.lang.Class': require('../primitive_type/java.lang.class'),
  'java.util.Currency': require('../primitive_type/java.util.currency'),
  'java.math.BigDecimal': require('../primitive_type/java.math.bigdecimal'),
  'java.util.Locale': require('../primitive_type/java.util.locale'),
  'java.lang.Exception': require('../primitive_type/java.lang.exception'),
  'java.lang.StackTraceElement': require('../primitive_type/java.lang.stacktraceelement'),
  'java.lang.Object': require('../primitive_type/java.lang.object'),
  'java.util.concurrent.atomic.AtomicLong': require('../primitive_type/java.util.concurrent.atomic.atomiclong'),
};
const arrayTypeMap = {
  'java.util.Locale': 'com.caucho.hessian.io.LocaleHandle',
};
const bufferType = {
  byte: true,
  'java.lang.Byte': true,
};

let ENABLE_DEBUG = !!process.env.HESSIAN_COMPILE_DEBUG;
let DEBUG_DIR = process.env.HESSIAN_COMPILE_DEBUG_DIR;

/**
 * 预编译
 *
 * @param {Object} info
 *   - {String} $class - 类名
 * @param {String} version - hessian 版本：1.0, 2.0
 * @param {Object} classMap - 类型映射
 * @param {Object} options - compile 参数
 * @param {Boolean} options.debug - 预编译文件是否落盘
 * @param {String} options.debugDir - 落盘位置
 * @return {Function} serializeFn
 */
module.exports = (info, version, classMap, options = {}) => {
  options = Object.assign({}, options, {
    debug: ENABLE_DEBUG,
    debugDir: DEBUG_DIR,
  });

  info.type = info.type || info.$class;
  const uniqueId = utils.normalizeUniqId(info, version);
  return compile(uniqueId, info, classMap, version, options);
};

function compileProp(gen, info, key, classInfo, version, options) {
  const attr = Object.create(null, Object.getOwnPropertyDescriptors(classInfo[key]));

  // generic param pass handle
  if (Array.isArray(attr.generic)) {
    attr.generic = parseGenericTypeVar(attr.generic, info);
  }

  if (has(attr, 'typeAliasIndex') && Array.isArray(info.generic)) {
    const refType = info.generic[attr.typeAliasIndex];
    attr.type = refType.type;
    if (refType.generic) attr.generic = refType.generic;
    if (refType.isArray) attr.isArray = refType.isArray;
    if (refType.isMap) attr.isMap = refType.isMap;
    if (refType.isEnum) attr.isEnum = refType.isEnum;
    if (refType.arrayDepth) attr.arrayDepth = refType.arrayDepth;
  }
  const uniqueId = utils.normalizeUniqId(attr, version);
  const desc = Object.getOwnPropertyDescriptor(attr, 'defaultValue');
  if (!desc) {
    gen('compile(\'%s\', %j, classMap, version, %j)(obj[\'%s\'], encoder, appClassMap);', uniqueId, attr, options, key);
  } else {
    Object.defineProperty(attr, 'defaultValue', Object.assign({}, desc, { enumerable: false }));
    const dv = desc.get ? `({ ${utils.getterStringify(desc.get)} }).defaultValue` : JSON.stringify(desc.value);
    gen('compile(\'%s\', %j, classMap, version, %j)(utils.has(obj, \'%s\') ? obj[\'%s\'] : %s, encoder, appClassMap);', uniqueId, attr, options, key, key, dv);
  }
}

function parseGenericTypeVar(generic, info) {
  const newGeneric = [];
  for (const genericItem of generic) {
    let newType = genericItem;
    if (genericItem.typeVar === true && has(genericItem, 'typeAliasIndex') && Array.isArray(info.generic)) {
      newType = Object.create(null, Object.getOwnPropertyDescriptors(info.generic[genericItem.typeAliasIndex]));
    }

    // recursive handle
    if (Array.isArray(genericItem.generic)) {
      newType.generic = parseGenericTypeVar(genericItem.generic, info);
    }
    newGeneric.push(newType);
  }
  return newGeneric;
}

/**
 * special key to determine the map structure logic
 * @param {Map<string, object>} classMap class data required for compile
 */
function getCompileCache(classMap) {
  if (!cache.get(classMapCacheOn)) {
    return cache;
  }
  // If there is a special key, the cache uses the classmap dimension to establish a secondary cache structure. Different classmaps use different caches
  if (!cache.has(classMap)) {
    cache.set(classMap, new Map());
  }
  return cache.get(classMap);
}

function compile(uniqueId, info, classMap, version, options) {
  const compileCache = getCompileCache(classMap);
  let encodeFn = compileCache.get(uniqueId);
  if (encodeFn) return encodeFn;

  const type = info.type || info.$class;
  // 先获取 classInfo，因为 type 后面会变
  const classInfo = classMap && classMap[type];

  const gen = codegen([ 'obj', 'encoder', 'appClassMap' ], 'encode');
  if (info.isArray) {
    gen('if (obj == null) { return encoder.writeNull(); }');
    const arrayDepth = info.arrayDepth || 1;
    if (bufferType[type] && arrayDepth === 1) {
      gen('encoder.writeBytes(obj);');
    } else {
      let arrayType = arrayTypeMap[type] || type;
      for (let i = 0; i < arrayDepth; i++) arrayType = '[' + arrayType;

      gen('if (encoder._checkRef(obj)) { return; }');
      gen('const hasEnd = encoder._writeListBegin(obj.length, \'%s\');', arrayType);

      const item = arrayDepth > 1 ? {
        type,
        arrayDepth: arrayDepth - 1,
        isMap: info.isMap,
        isEnum: info.isEnum,
        isArray: info.isArray,
        generic: info.generic,
        abstractClass: info.abstractClass,
      } : {
        type,
        isMap: info.isMap,
        isEnum: info.isEnum,
        generic: info.generic,
        abstractClass: info.abstractClass,
      };
      const uniqueId = utils.normalizeUniqId(item, version);
      gen('for (const item of obj) {');
      gen('  compile(\'%s\', %j, classMap, version, %j)(item, encoder, appClassMap);', uniqueId, item, options);
      gen('}');
      gen('if (hasEnd) { encoder.byteBuffer.putChar(\'z\'); }');
    }
  } else if (typeMap[type]) {
    typeMap[type](gen, info, version, options);
  } else if (info.isMap) {
    typeMap['java.util.Map'](gen, info, version, options);
  } else if (info.isEnum) {
    gen('let type = \'%s\';', type);
    gen('if (obj && obj.$class) { type = obj.$class; obj = obj.$; }');
    gen('if (obj == null) { return encoder.writeNull(); }');
    gen('encoder.objects.push(obj);');
    gen('const name = obj.$name || obj.name || obj;');
    gen('const clazz = classMap[type];');
    gen('if (clazz) {');
    gen('  const item = clazz.getBy(\'$name\', name);');
    gen('  if (!item)');
    gen('    throw new Error(`enum: ${type} have no name: ["${name}"]`);');
    gen('}');

    if (version === '1.0') {
      gen('encoder.byteBuffer.put(0x4d);');
      gen('encoder.writeType(\'%s\');', type);
      gen('encoder.writeString(\'name\');');
      gen('encoder.writeString(name);');
      gen('encoder.byteBuffer.put(0x7a);');
    } else {
      gen('const ref = encoder._writeObjectBegin(\'%s\');', type);
      gen('if (ref === -1) {');
      gen('encoder.writeInt(1);');
      gen('encoder.writeString(\'name\');');
      gen('encoder._writeObjectBegin(\'%s\'); }', type);
      gen('encoder.writeString(name);');
    }
  } else if (classInfo && !info.abstractClass && !info.$abstractClass) {
    gen('if (obj == null) { return encoder.writeNull(); }');
    gen('if (obj && obj.$class) {');
    gen('  const fnKey = utils.normalizeUniqId(obj, version);');
    gen('  compile(fnKey, obj, classMap, version, %j)(obj.$, encoder, appClassMap);', options);
    gen('  return;');
    gen('}');
    gen('if (encoder._checkRef(obj)) { return; }');

    const keys = classInfo ? Object.keys(classInfo).filter(key => {
      const attr = classInfo[key];
      return !attr.isStatic && !attr.isTransient;
    }) : [];

    if (version === '1.0') {
      gen('encoder.byteBuffer.put(0x4d);');
      gen('encoder.writeType(\'%s\');', type);
      for (const key of keys) {
        gen('encoder.writeString(\'%s\');', key);
        compileProp(gen, info, key, classInfo, version, options);
      }
      gen('encoder.byteBuffer.put(0x7a);');
    } else {
      gen('const ref = encoder._writeObjectBegin(\'%s\');', type);
      gen('if (ref === -1) {');
      gen('encoder.writeInt(%d);', keys.length);
      for (const key of keys) {
        gen('encoder.writeString(\'%s\');', key);
      }
      gen('encoder._writeObjectBegin(\'%s\'); }', type);

      for (const key of keys) {
        compileProp(gen, info, key, classInfo, version, options);
      }
    }
  } else {
    gen('if (obj == null) { return encoder.writeNull(); }');
    gen('if (obj && obj.$class) {');
    gen('  const fnKey = utils.normalizeUniqId(obj, version);');
    gen('  compile(fnKey, obj, classMap, version, %j)(obj.$, encoder, appClassMap);', options);
    gen('}');
    gen('else { encoder.write({ $class: \'%s\', $: obj }); }', type);
  }
  if (!options.debug) {
    encodeFn = gen({ compile, classMap, version, utils });
  } else {
    assert(options.debugDir, 'debugDir is empty, please set debugDir in options or HESSIAN_COMPILE_DEBUG_DIR');
    const func = `
module.exports = function (compile, classMap, version, utils) {
  return ${gen.toString()};
};
`;
    const jsFile = path.join(options.debugDir, `${uniqueId}.js`);
    fs.writeFileSync(jsFile, func);
    encodeFn = require(jsFile)(compile, classMap, version, utils);
  }
  compileCache.set(uniqueId, encodeFn);
  return encodeFn;
}

module.exports.cache = cache;

// for special use, don't do this unless you know what u'r doing
module.exports.setCache = function(newCache) {
  cache = newCache;
};
module.exports.getCache = function() {
  return cache;
};

module.exports.classMapCacheOn = classMapCacheOn;

// only for unittest
module.exports.setDebugOptions = (enableDebug, debugDir) => {
  ENABLE_DEBUG = enableDebug;
  DEBUG_DIR = debugDir;
};
