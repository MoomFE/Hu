const { resolve } = require('path');
const { copy, readdir } = require('fs-extra');

const dirname = resolve( __dirname, '../../' );
const node_modules = resolve( dirname, 'node_modules' );
const to = resolve( dirname, 'test/Lib' );
const js = /\.js$/;
const writeOptions = {
  overwrite: true
};


// 拷贝测试所需的类库文件到测试文件夹中
[
  { dir: 'mocha', name: 'mocha.js' },
  { dir: 'mocha', name: 'mocha.css' },
  { dir: 'chai', name: 'chai.js' },
  { dir: '@moomfe/zenjs/dist', name: 'zen.fat.js' },
  { dir: '@webcomponents/webcomponentsjs', name: 'webcomponents-loader.js' }
].forEach(({ dir, name }) => {
  copy(
    resolve( node_modules, dir, name ),
    resolve( to, name ),
    writeOptions
  );
});

// 拷贝最新的 polyfill 到测试文件夹中
readdir( resolve( node_modules, '@webcomponents/webcomponentsjs/bundles' ), ( err, names ) => {
  for( const name of names ) js.test( name ) && copy(
    resolve( node_modules, '@webcomponents/webcomponentsjs/bundles', name ),
    resolve( to, 'bundles', name ),
    writeOptions
  );
});