'use strict';

module.exports = {
  plugins: ['prettier-plugin-ember-template-tag'],
  overrides: [
    {
      files: '*.{js,ts,gts,gjs}',
      options: {
        singleQuote: true,
      },
    },
  ],
};
