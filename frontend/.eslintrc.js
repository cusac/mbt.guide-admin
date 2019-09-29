// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'eslint:recommended',
    'prettier/vue',
  ],
  // plugins: ['prettier'],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'prettier/prettier': 'error',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any',
        },
      },
    ],
    'vue/max-attributes-per-line': false,
    //TODO: re-enable this and set types
    'vue/require-prop-types': false,
    'no-console': 0,
  },
};
