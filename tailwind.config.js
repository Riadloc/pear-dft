module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        paper: '#202125',
        card: '#292a2d',
        gold: '#eee0c5'
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}
