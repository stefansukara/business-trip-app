module.exports = {
    parserOptions: {
      ecmaVersion: 7
    },
    plugins: [
      "standard",
      "promise"
    ],
    rules: {
      "quote-props": ["error", "consistent-as-needed"]
    }
  };