module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  plugins:[
    'prettier'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier":"error",
    "class-methods-use-this": "off", //this era obrigatorio
    "no-param-reassign": "off", //recebe um parametro e altera um parametro
    "camelcase": "off", //fomato camel case desabilitado
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }] //não dá erro com variável não utilizadad
  },
};
