const { moveSync, emptyDirSync, readFile } = require('fs-extra');
const { resolve } = require('path');


const fromBuild = resolve( __dirname, '../../../../build' );
const from = resolve( fromBuild, 'polymer/src/shared/dependencies/polymer/src' );
const to = resolve( __dirname, 'build' );

// 将代码移入文件夹
moveSync( from, to, {
  overwrite: true
});

// 清空原始文件夹
emptyDirSync( fromBuild );