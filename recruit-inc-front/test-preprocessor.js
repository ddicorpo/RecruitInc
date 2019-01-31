/**
 * Configuration files to transpile Typescript into JS
 * for our Front-End Test
 * code from: https://medium.com/@mateuszsokola/configuring-react-16-jest-enzyme-typescript-7122e1a1e6e8
 */

const tsc = require('typescript');
const configurationTS = require('./tsconfig');

module.exports = {
  process(src, path) {
    if (path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.js')) {
      return tsc.transpile(src, configurationTS.compilerOptions, path, []);
    }
    return src;
  },
};
