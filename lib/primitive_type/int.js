'use strict';

module.exports = gen => {
  gen('if (obj && obj.$class) { obj = obj.$; }');
  gen('if (obj == null) {');
  gen('  obj = 0;');
  gen('} else if (typeof obj == \'string\') {');
  gen('  const val = parseInt(obj, 10);');
  gen('  if (!isNaN(val)) {');
  gen('    obj = val;');
  gen('  }');
  gen('}');
  gen('encoder.writeInt(obj);');
};
