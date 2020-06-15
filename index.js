'use strict';

const v3 = require('./lib/v3');
const v4 = require('./lib/v4');

exports.v3 = v3;
exports.v4 = v4;

exports.encode = v3.encode;
exports.decode = v3.decode;
exports.compile = v3.compile;
