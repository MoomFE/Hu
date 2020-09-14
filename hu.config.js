const typescript = require('rollup-plugin-typescript2');

/** 当前执行的指令 */
const HU_RUNNING_COMMAND = process.env.HU_RUNNING_COMMAND;

module.exports = {
  mode: HU_RUNNING_COMMAND === 'build',
  input: 'index.ts',
  replace: {
    'process.env.NODE_ENV': JSON.stringify(HU_RUNNING_COMMAND === 'build' ? 'production' : 'development')
  },
  plugins: () => {
    return [
      typescript({
        module: 'ESNext'
      })
    ];
  },
  pluginOptions: {
    babel: {
      extensions: ['.js', '.ts']
    }
  },
  browserslist: [
    'last 2 Chrome versions'
  ]
};
