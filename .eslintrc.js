module.exports = {
  extends: ['standard', 'prettier'],
  plugins: ['standard', 'node', 'promise', 'prettier'],
  env: {
    es6: true,
    node: true,
    browser: false
  },
  rules: {
    'no-var': 1,
    'prefer-arrow-callback': 2,
    'no-undef': 0,
    'space-before-function-paren': 0,
    // 'space-before-function-paren': ['error', 'never'],
    'prefer-promise-reject-errors': 0,
    'no-throw-literal': 0,
    quotes: ['error', 'single'],
    semi: ['error'],
    'no-return-await': 0
  }
};
