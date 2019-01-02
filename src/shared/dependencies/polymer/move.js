const { moveSync, emptyDirSync, readFile } = require('fs-extra');
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
emptyDirSync( fromBuild );

/* ------------------------------------ */

const html = resolve( to, 'index.html' );
const rScript = /<script>(.+?)<\/script>/;


// 提取 babelHelpers
readFile( html ).then( buffer => {
  const html = buffer.toString();
  const result = [];

  html
    .match( rScript )
    .map( script => {
      
    });
});