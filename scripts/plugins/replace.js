const replace = require('rollup-plugin-replace');
const packages = require('../../package.json');

const productionReplace = replace({
  'process.env.NODE_ENV': JSON.stringify('production'),
  '__VERSION__': packages.version
});
const developmentReplace = replace({
  'process.env.NODE_ENV': JSON.stringify('development'),
  '__VERSION__': packages.version
});


module.exports = isProduction => {
  return isProduction ? productionReplace
                      : developmentReplace;
}