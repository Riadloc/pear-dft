module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 16,
      propList: ['*'],
      exclude(file) {
        return file.indexOf('vant') === -1
      }
    }
  }
}
