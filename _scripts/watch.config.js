require('./extras/copy-polyfill');

const basic = require('./basic.config');
const copy = require('./plugins/copy-to-test');


basic.plugins.push(
  // 复制到测试文件夹
  copy
);


module.exports = basic;