'use strict';

module.exports = gen => {
  gen('if (obj == null) { return encoder.writeNull(); }');
  gen('if (typeof obj === \'number\') { obj = obj.toString(); }');
  gen('encoder.writeString(obj);');
};
