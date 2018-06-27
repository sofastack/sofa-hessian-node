'use strict';

const compile = require('./lib/compile');

const encoderV1 = require('hessian.js-1').encoderV1;
const encoderV2 = require('hessian.js-1').encoderV2;

exports.encode = (obj, version, classMap, appClassMap) => {
  const encoder = version === '2.0' ? encoderV2 : encoderV1;
  encoder.reset();
  if (classMap) {
    compile(obj, version, classMap)(obj.$, encoder, appClassMap);
  } else {
    encoder.write(obj);
  }
  return encoder.get();
};
exports.decode = require('hessian.js-1').decode;
exports.compile = compile;
