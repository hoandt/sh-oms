const pluginSortImports = require("@trivago/prettier-plugin-sort-imports");

/**
 * @refs  https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/31#issuecomment-1195411734
 */
/** @type {import("prettier").Parser}  */
const bothParser = {
  ...pluginSortImports.parsers.typescript,
};

/** @type {import("prettier").Plugin}  */
const mixedPlugin = {
  parsers: {
    typescript: bothParser,
  },
};

module.exports = {
  arrowParens: "avoid",
  bracketSameLine: true,
  bracketSpacing: true,
  singleQuote: true,
  trailingComma: "all",
  tabWidth: 2,
  semi: true,
  printWidth: 100,
  plugins: [mixedPlugin],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
