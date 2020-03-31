
module.exports = {
  root: true,
  env: {
    browser: true
  },
  extends: [
    './node_modules/@moomfe/hu-cli/.eslintrc.js'
  ],
  rules: {
    'import/no-extraneous-dependencies': 'off'
  }
};