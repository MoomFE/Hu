require('./@moomfe/zenjs');
require('./extras/copy-polyfill');

const basic = require('./basic.config');
const copy = require('./plugins/copy-to-test');


const configs = [];

// 复制到测试文件夹
configs.filter( config => config.output.file === basic.output.file ).forEach( config => {
  config.plugins.push( copy );
});


module.exports = configs;