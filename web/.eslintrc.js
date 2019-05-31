module.exports = {
  extends: ["standard", "standard-react", "plugin:import/errors", "plugin:import/warnings"],
  rules: {
    "react/prop-types": 0,
    "object-curly-spacing": ["error", "never"],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  settings: {
    react: {
      pragma: "React",
      version: "16.8.4"
    }
  }
};
