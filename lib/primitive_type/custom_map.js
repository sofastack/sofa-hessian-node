'use strict';

const utils = require('../utils');

module.exports = (gen, classInfo, version, options) => {
  gen('if (obj == null) { return encoder.writeNull(); }');
  gen('if (encoder._checkRef(obj)) { return; }');

  const generic = classInfo.generic;

  if (version === '1.0') {
    gen('encoder.byteBuffer.put(0x4d);');
    gen('encoder.writeType(\'%s\');', classInfo.type);
    if (generic && generic.length === 2) {
      gen('if (obj instanceof Map) {');
      gen('  for (const entry of obj.entries()) {');
      gen('    const key = entry[0];');
      gen('    const value = entry[1];');
      const genericKeyDefine = utils.normalizeType(generic[0]);
      const genericValueDefine = utils.normalizeType(generic[1]);
      const keyId = utils.normalizeUniqId(genericKeyDefine, version);
      const valueId = utils.normalizeUniqId(genericValueDefine, version);
      gen('    const encodeKey = compile(\'%s\', %j, classMap, version, %j); encodeKey(key, encoder, appClassMap);', keyId, genericKeyDefine, options);
      gen('    const encodeValue = compile(\'%s\', %j, classMap, version, %j); encodeValue(value, encoder, appClassMap);', valueId, genericValueDefine, options);
      gen('  }\n  } else {');
      gen('  for (const key in obj) {');
      gen('    const value = obj[key];');
      const convertor = utils.converts[genericKeyDefine.type];
      if (convertor) {
        gen('    const encodeKey = compile(\'%s\', %j, classMap, version, %j); encodeKey(%s(key), encoder, appClassMap);', keyId, genericKeyDefine, options, convertor);
      } else {
        gen('    const encodeKey = compile(\'%s\', %j, classMap, version, %j); encodeKey(key, encoder, appClassMap);', keyId, genericKeyDefine, options);
      }
      gen('    const encodeValue = compile(\'%s\', %j, classMap, version, %j); encodeValue(value, encoder, appClassMap);', valueId, genericValueDefine, options);
      gen('  }\n  }');
    } else {
      gen('if (obj instanceof Map) {');
      gen('  for (const entry of obj.entries()) {');
      gen('    const key = entry[0];');
      gen('    const value = entry[1];');
      gen('    encoder.writeString(key);');
      gen('    if (value && value.$class) {');
      gen('      const fnKey = utils.normalizeUniqId(value, version);');
      gen('      compile(fnKey, value, appClassMap, version, %j)(value.$, encoder);', options);
      gen('    } else {');
      gen('      encoder.write(value);');
      gen('    }');
      gen('  }\n  } else {');
      gen('  for (const key in obj) {');
      gen('    const value = obj[key];');
      gen('    encoder.writeString(key);');
      gen('    if (value && value.$class) {');
      gen('      const fnKey = utils.normalizeUniqId(value, version);');
      gen('      compile(fnKey, value, appClassMap, version, %j)(value.$, encoder);', options);
      gen('    } else {');
      gen('      encoder.write(value);');
      gen('    }');
      gen('  }\n  }');
    }
    gen('encoder.byteBuffer.put(0x7a);');
  } else {
    gen('const keys = obj instanceof Map ? Array.from(obj.keys()) : Object.keys(obj)');
    gen('const ref = encoder._writeObjectBegin(\'%s\', keys);', classInfo.type);
    if (generic && generic.length === 2) {
      const genericKeyDefine = utils.normalizeType(generic[0]);
      const genericValueDefine = utils.normalizeType(generic[1]);
      const keyId = utils.normalizeUniqId(genericKeyDefine, version);
      const valueId = utils.normalizeUniqId(genericValueDefine, version);
      gen('if (obj instanceof Map) {');
      gen('  if (ref === -1) {');
      gen('    encoder.writeInt(keys.length);');
      gen('    for (const key of keys) {');
      gen('      const encodeKey = compile(\'%s\', %j, classMap, version, %j); encodeKey(key, encoder, appClassMap);', keyId, genericKeyDefine, options);
      gen('    }');
      gen('    encoder._writeObjectBegin(\'%s\');', classInfo.type);
      gen('  }');
      gen('  for (const value of obj.values()) {');
      gen('    const encodeValue = compile(\'%s\', %j, classMap, version, %j); encodeValue(value, encoder, appClassMap);', valueId, genericValueDefine, options);
      gen('  }');
      gen('} else {');
      gen('  if (ref === -1) {');
      gen('    encoder.writeInt(keys.length);');
      gen('    for (const key of keys) {');
      const convertor = utils.converts[genericKeyDefine.type];
      if (convertor) {
        gen('      const encodeKey = compile(\'%s\', %j, classMap, version, %j); encodeKey(%s(key), encoder, appClassMap);', keyId, genericKeyDefine, options, convertor);
      } else {
        gen('      const encodeKey = compile(\'%s\', %j, classMap, version, %j); encodeKey(key, encoder, appClassMap);', keyId, genericKeyDefine, options);
      }
      gen('    encoder._writeObjectBegin(\'%s\');', classInfo.type);
      gen('    }');
      gen('  }');
      gen('  for (const key of keys) {');
      gen('    const value = obj[key];');
      gen('    const encodeValue = compile(\'%s\', %j, classMap, version, %j); encodeValue(value, encoder, appClassMap);', valueId, genericValueDefine, options);
      gen('  }');
      gen('}');
    } else {
      gen('if (obj instanceof Map) {');
      gen('  if (ref === -1) {');
      gen('    encoder.writeInt(keys.length);');
      gen('    for (const key of keys) {');
      gen('      encoder.writeString(key);');
      gen('    }');
      gen('    encoder._writeObjectBegin(\'%s\');', classInfo.type);
      gen('  }');
      gen('  for (const value of obj.values()) {');
      gen('    if (value && value.$class) {');
      gen('      const fnKey = utils.normalizeUniqId(value, version);');
      gen('      compile(fnKey, value, appClassMap, version, %j)(value.$, encoder);', options);
      gen('    } else {');
      gen('      encoder.write(value);');
      gen('    }');
      gen('  }');
      gen('} else {');
      gen('  if (ref === -1) {');
      gen('    encoder.writeInt(keys.length);');
      gen('    for (const key of keys) {');
      gen('      encoder.writeString(key);');
      gen('    }');
      gen('    encoder._writeObjectBegin(\'%s\');', classInfo.type);
      gen('  }');
      gen('  for (const key of keys) {');
      gen('    const value = obj[key];');
      gen('    if (value && value.$class) {');
      gen('      const fnKey = utils.normalizeUniqId(value, version);');
      gen('      compile(fnKey, value, appClassMap, version, %j)(value.$, encoder);', options);
      gen('    } else {');
      gen('      encoder.write(value);');
      gen('    }');
      gen('  }');
      gen('}');
    }
  }
};
