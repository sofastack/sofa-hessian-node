'use strict';

const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');
const suite = new Benchmark.Suite();

const HESSIAN_COMPILE_DEBUG = process.env.HESSIAN_COMPILE_DEBUG;
// eslint-disable-next-line no-unused-vars
let envVal;
// add tests
suite
  .add('read env', function() {
    envVal = process.env.HESSIAN_COMPILE_DEBUG;
  })
  .add('pre read', function() {
    envVal = HESSIAN_COMPILE_DEBUG;
  })
  .on('cycle', function(event) {
    benchmarks.add(event.target);
  })
  .on('start', function() {
    console.log('\n  node version: %s, date: %s\n  Starting...', process.version, Date());
  })
  .on('complete', function done() {
    benchmarks.log();
  })
  .run({ async: false });
