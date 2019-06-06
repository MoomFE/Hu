require('./extras/copy-polyfill');

const basic = require('./basic.config');
const replace = require('./plugins/replace');
const copy = require('./plugins/copy-to-test');


basic.plugins.push(
  // 字符串替换
  replace( true ),
  // 复制到测试文件夹
  copy
);


module.exports = basic;