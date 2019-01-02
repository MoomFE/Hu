const { moveSync, readFileSync, outputFileSync, removeSync } = require('fs-extra');
const { resolve } = require('path');


/* ------------------------------------ */

const fromBuild = resolve( __dirname, '../../../../build' );
const from = resolve( fromBuild, 'polymer/src/shared/dependencies/polymer/src' );
const to = resolve( __dirname, 'build' );

// 将代码移入文件夹
moveSync( from, to, {
  overwrite: true
});

// 清空原始文件夹
removeSync( fromBuild );

/* ------------------------------------ */

const banner = `import babelHelpers from '../polyfill/babelHelpers';\nimport regeneratorRuntime from '../polyfill/regeneratorRuntime';\n\n\n`;
const polymer = resolve( to, 'index.js' );

// 自动添加一些代码
outputFileSync(
  polymer,
  `${ banner }${
    readFileSync( polymer ).toString()
  }`
);

/* ------------------------------------ */