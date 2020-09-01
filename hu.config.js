/** 当前执行的指令 */
const HU_RUNNING_COMMAND = process.env.HU_RUNNING_COMMAND;

module.exports = {
  mode: HU_RUNNING_COMMAND === 'build',
  input: 'index.ts',
  replace: {
    'process.env.NODE_ENV': JSON.stringify(HU_RUNNING_COMMAND === 'build' ? 'production' : 'development')
  },
  pluginOptions: {
    babel: {
      babelrc: false,
      exclude: [/\/node_modules\//],
      extensions: ['.js', '.ts'],
      presets: [
        ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3, targets: 'browserslist' }],
        ['@babel/preset-typescript', { allowNamespaces: true }]
      ]
    }
  },
  browserslist: [
    'last 2 Chrome versions'
  ]
};
