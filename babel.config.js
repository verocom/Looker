module.exports = (api) => {
  const isTest = api.env("test");
  api.cache(true);

  return {
    presets: [
      [
        "@babel/env",
        {
          targets: {
            esmodules: true,
          },
          modules: isTest ? "auto" : false,
        },
      ],
      [
        "@babel/preset-react",
        {
          development: process.env.BABEL_ENV !== "build",
        },
      ],
    ],
    env: {
      build: {
        ignore: ["**/*.test.js", "**/*.test.jsx", "__snapshots__", "__tests__"],
      },
    },
    ignore: ["node_modules"],
    plugins: [
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-object-rest-spread",
      "@babel/plugin-transform-runtime",
      "babel-plugin-styled-components",
    ],
  };
};
