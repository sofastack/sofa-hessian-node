'use strict';

module.exports = (gen, classInfo, version) => {
  gen('if (obj && obj.$class) { obj = obj.$; }');
  gen('if (obj == null) { return encoder.writeNull(); }');
  gen('if (encoder._checkRef(obj)) { return; }');

  gen('if (typeof obj === \'object\' && obj.currencyCode) {');
  gen('  obj = obj.currencyCode');
  gen('}');

  const type = classInfo.type || classInfo.$class;

  if (version === '1.0') {
    gen('encoder.byteBuffer.put(0x4d);');
    gen('encoder.writeType(\'%s\');', type);
    gen('encoder.writeString(\'currencyCode\');');
    gen('encoder.writeString(obj);');
    gen('encoder.byteBuffer.put(0x7a);');
  } else {
    gen('const ref = encoder._writeObjectBegin(\'%s\');', type);
    gen('if (ref === -1) {');
    gen('  encoder.writeInt(1);');
    gen('  encoder.writeString(\'currencyCode\');');
    gen('  encoder._writeObjectBegin(\'%s\');\n}', type);
    gen('encoder.writeString(obj);');
  }
};
