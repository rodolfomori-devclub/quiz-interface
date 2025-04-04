module.exports = {
  printWidth: 160,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
}
