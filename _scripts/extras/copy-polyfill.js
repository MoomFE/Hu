const { resolve } = require('path');
const { copy, readdir } = require('./fs-extra');

const dirname = resolve( __dirname, '../../' );
const from = resolve( dirname, 'node_modules/@webcomponents/webcomponentsjs' );
const to = resolve( dirname, 'test/Lib' );
const rSearch = /\.js$/;


// 拷贝最新的 polyfill 加载器到测试文件夹中
copy(
  resolve( from, 'webcomponents-loader.js' ),
  resolve( to, 'webcomponents-loader.js' ),
  {
    overwrite: true
  }
);

// 拷贝最新的 polyfill 到测试文件夹中
readdir( resolve( from, 'bundles' ), ( err, files ) => {
  files.forEach( name => {
    rSearch.test( name ) && copy(
      resolve( from, 'bundles', name ),
      resolve( to, 'bundles', name ),
      {
        overwrite: true
      }
    );
  });
});