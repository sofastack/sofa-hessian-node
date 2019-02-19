'use strict';

const utils = require('../utils');

module.exports = (gen, classInfo, version, options) => {
  gen('if (obj && obj.$class) { obj = obj.$; }');
  gen('if (obj == null) { return encoder.writeNull(); }');
  gen('if (encoder._checkRef(obj)) { return; }');

  gen('if (typeof obj === \'object\') {');
  gen('  obj = obj.value || 0');
  gen('}');

  const attr = { type: 'long' };
  const uniqueId = utils.normalizeUniqId(attr, version);
  if (version === '1.0') {
    gen('encoder.byteBuffer.put(0x4d);');
    gen('encoder.writeType(\'java.util.concurrent.atomic.AtomicLong\');');
    gen('encoder.writeString(\'value\');');
    gen('compile(\'%s\', %j, classMap, version, %j)(obj, encoder);', uniqueId, attr, options);
    gen('encoder.byteBuffer.put(0x7a);');
  } else {
    gen('const ref = encoder._writeObjectBegin(\'java.util.concurrent.atomic.AtomicLong\');');
    gen('if (ref === -1) {');
    gen('encoder.writeInt(1);');
    gen('encoder.writeString(\'value\');');
    gen('encoder._writeObjectBegin(\'java.util.concurrent.atomic.AtomicLong\'); }');
    gen('compile(\'%s\', %j, classMap, version, %j)(obj, encoder);', uniqueId, attr, options);
  }
};
