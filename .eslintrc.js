module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/essential',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': ['error', {
      asyncArrow: 'always',
      named: 'never',
      anonymous: 'never'
    }],
    camelcase: ['warn', {
      ignoreDestructuring: true
    }],
    '@typescript-eslint/no-unused-vars': ['error', {
      args: 'after-used'
    }],
    'vue/no-unused-vars': ['error', {
      ignorePattern: '^_'
    }],
    'vue/no-v-model-argument': 'off',
    semi: 'warn'
  }
}
