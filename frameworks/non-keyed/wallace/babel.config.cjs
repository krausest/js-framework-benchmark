module.exports = {
  plugins: [["babel-plugin-wallace", { flags: {} }], "@babel/plugin-syntax-jsx"],
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        targets: {
          browsers: ["last 1 chrome versions"],
        },
      },
    ],
  ],
};
