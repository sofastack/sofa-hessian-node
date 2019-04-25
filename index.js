'use strict';

const compile = require('./lib/compile');
const Enums = require('enums');

const encoderV1 = require('hessian.js-1').encoderV1;
const encoderV2 = require('hessian.js-1').encoderV2;

exports.encode = (obj, version, classMap, appClassMap, options) => {
  const encoder = version === '2.0' ? encoderV2 : encoderV1;
  appClassMap = appClassMap || classMap;
  encoder.reset();
  if (classMap) {
    // TODO 这个地方应该抽一个 registerBuiltinClass 的方法出来
    for (const clazz of Object.keys(classMap)) {
      const v = classMap[clazz];
      const info = { $class: clazz };
      if (v instanceof Enums) {
        info.isEnum = true;
      }
      compile(info, version, classMap, options);
    }
    compile(obj, version, appClassMap, options)(obj.$, encoder, appClassMap);
  } else {
    encoder.write(obj);
  }
  return encoder.get();
};
exports.decode = require('hessian.js-1').decode;
exports.compile = compile;
