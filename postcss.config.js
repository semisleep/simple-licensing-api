const webpack = require('webpack');
const postcssImport = require('postcss-import');
const postcssUrl = require('postcss-url');
const autoprefixer = require('autoprefixer');
const csswring = require('csswring');

module.exports = {
  plugins: [
    postcssImport({ addDependencyTo: webpack }),
    postcssUrl(),
    autoprefixer({ browsers: ['last 2 versions', '> 5%', 'Explorer >= 10', 'Android >= 2.3'] }),
    csswring()
  ]
};
