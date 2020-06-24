'use strict';

module.exports = gen => {
  gen('if (obj == null) { return encoder.writeNull(); }');
  gen('if (obj && obj.$class) {');
  gen('  const fnKey = utils.normalizeUniqId(obj, version);');
  gen('  compile(fnKey, obj, appClassMap, version, options)(obj.$, encoder, undefined, options);');
  gen('} else {');
  gen('  encoder.write(obj);');
  gen('}');
};
