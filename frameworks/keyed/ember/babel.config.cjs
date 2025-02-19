const { babelCompatSupport } = require('@embroider/compat/babel');

module.exports = {
  plugins: [
    [
      'babel-plugin-ember-template-compilation',
      {
        compilerPath: 'ember-source/dist/ember-template-compiler.js',
        enableLegacyModules: [
          'ember-cli-htmlbars',
          'ember-cli-htmlbars-inline-precompile',
          'htmlbars-inline-precompile',
        ],
        transforms: [],
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: __dirname,
        useESModules: true,
        regenerator: false,
      },
    ],
    // This can leave once
    // https://github.com/embroider-build/embroider/pull/2249
    // is merged
    ...babelCompatSupport(),
  ],

  generatorOpts: {
    compact: false,
  },
};
