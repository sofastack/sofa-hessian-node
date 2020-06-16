'use strict';

const compile = require('./compile');

const EncoderV2 = require('hessian.js').EncoderV2;
const DecoderV2 = require('hessian.js').DecoderV2;
const encoderV1 = require('hessian.js').encoderV1;
const encoderV2 = require('hessian.js').encoderV2;

exports.encode = (obj, version, classMap, appClassMap, options) => {
  const encoder = version === '2.0' ? encoderV2 : encoderV1;
  encoder.reset();
  if (classMap) {
    compile(obj, version, classMap, options)(obj.$, encoder, appClassMap);
  } else {
    encoder.write(obj);
  }
  return encoder.get();
};
exports.decode = require('hessian.js').decode;
exports.compile = compile;
exports.Encoder = EncoderV2;
exports.Decoder = DecoderV2;
