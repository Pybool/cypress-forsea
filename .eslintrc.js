module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:ticknovate/test',
    'plugin:ticknovate/node',
],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  },
  plugins:['ticknovate']
}
