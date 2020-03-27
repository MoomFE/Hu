require('./scripts/extras/copy-polyfill');
const pluginFixErrorInFirefox = require('./scripts/plugins/Fix-SyntaxError-error-in-Firefox-51-and-below');
const pluginCopyToTest = require('./scripts/plugins/copy-to-test');

const HU_RUNNING_COMMAND = process.env.HU_RUNNING_COMMAND;
const packages = require('./package.json');

const banner = `${packages.title} v${packages.version}\n${packages.homepage}\n\n(c) 2018-present ${packages.author}\nReleased under the MIT License.`;
const configs = [];
const pipe = [
  { output: 'hu.js' }
];


if (HU_RUNNING_COMMAND === 'build') {
  // UMD Minify
  pipe.$each((config) => {
    pipe.push(
      Object.$assign(null, config, {
        mode: true,
        output: config.output.replace(/\.js$/, '.min.js')
      })
    );
  });
  // Other
  pipe.$each((config) => {
    // CommonJS
    config.mode || pipe.push(
      Object.$assign(null, config, {
        format: 'cjs',
        output: config.output.replace(/\.js$/, '.common.js')
      })
    );
    // ES Module
    config.mode || pipe.push(
      Object.$assign(null, config, {
        format: 'esm',
        output: config.output.replace(/\.js$/, '.esm.js')
      })
    );
    // ES Module Browser + ES Module Browser Minify
    pipe.push(
      Object.$assign(null, config, {
        format: 'esm.browser',
        output: config.mode ? config.output.replace(/\.min\.js$/, '.esm.browser.min.js')
          : config.output.replace(/\.js$/, '.esm.browser.js')
      })
    );
  });
}

configs.push({
  mode: false,
  input: 'build/index.js',
  format: 'umd',
  name: 'Hu',
  banner,
  replace: {
    'process.env.NODE_ENV': JSON.stringify(HU_RUNNING_COMMAND === 'build' ? 'production' : 'development'),
    __VERSION__: packages.version
  },
  plugins: (config) => [
    pluginFixErrorInFirefox,
    config._originConfig.output === 'hu.js' && pluginCopyToTest
  ],

  pipe
});

if (HU_RUNNING_COMMAND === 'watch') {
  configs.push(
    require('./test/Test/hu.config')
  );
}

module.exports = configs;
