/**
 * Configuration files to transpile Typescript into JS
 * for our Front-End Test
 * code from: https://medium.com/@mateuszsokola/configuring-react-16-jest-enzyme-typescript-7122e1a1e6e8
 */

const tsc = require('typescript');
//const tsConfig = require('./tsconfig.json');

module.exports = {
  process(src, path) {
    if (path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.js')) {
      return tsc.transpile(src, copyConfig.compilerOptions, path, []);
    }
    return src;
  },
};

copyConfig = {
  compilerOptions: {
    jsx: 'react',
    target: 'es2015',
    module: 'commonjs',
    moduleResolution: 'node',
    forceConsistentCasingInFileNames: true,
    preserveConstEnums: true,
    sourceMap: true,
    removeComments: true,
    noImplicitReturns: true,
    noImplicitThis: true,
    noImplicitAny: false,
    strictNullChecks: true,
    suppressImplicitAnyIndexErrors: true,
    noUnusedLocals: true,
    esModuleInterop: true,
    outDir: './build/',
    allowSyntheticDefaultImports: true,
    resolveJsonModule: true,
    // Allowing Jest to work
    skipLibCheck: true,
  },
  exclude: ['node_modules', './test/**/*'],
  include: ['./src/**/**/*'],
};
