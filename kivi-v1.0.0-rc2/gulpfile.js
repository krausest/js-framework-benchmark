const gulp = require('gulp');
const typescript = require('typescript');
const ts = require('gulp-typescript');
//const tslint = require("gulp-tslint");
const rollup = require('rollup');
const rollupReplace = require('rollup-plugin-replace');
const rollupNodeResolve = require('rollup-plugin-node-resolve');
const closureCompiler = require('google-closure-compiler-js').gulp();

const ClosureConfig = {
  compilation_level: 'ADVANCED',
//  entry_point: 'goog:main',
//  dependency_mode: 'STRICT',
  languageIn: 'ECMASCRIPT6_STRICT',
  languageOut: 'ECMASCRIPT5_STRICT',
  useTypesForOptimization: true,
  assumeFunctionWrapper: true,
//  output_wrapper: '(function(){%output%}).call();',
//  summary_detail_level: 3,
  warningLevel: 'QUIET',
};

function clean() {
  const del = require('del');
  return del(['build', 'dist']);
}

function compileTS() {
  return gulp.src('main.ts')
/*    .pipe(tslint({
      formatter: "verbose",
    }))*/
    .pipe(ts(Object.assign(require('./tsconfig.json').compilerOptions, {
      typescript: require('typescript'),
    })))
    .pipe(gulp.dest('build/es6'));
}

function bundle(done) {
  return rollup.rollup({
    format: 'es6',
    entry: 'build/es6/main.js',
    plugins: [
      rollupReplace({
        delimiters: ['<@', '@>'],
        values: {
          KIVI_DEBUG: 'DEBUG_DISABLED',
        },
      }),
      rollupNodeResolve(),
    ]
  }).then(function(bundle) {
    return bundle.write({
      format: 'es',
      dest: 'build/main.es6.js',
      intro: 'goog.module("main");',
      sourceMap: 'inline',
    });
  });
}

function compile() {
  return gulp.src(['build/main.es6.js'])
      .pipe(closureCompiler(Object.assign({}, ClosureConfig, {
        js_output_file: 'main.js',
      })))
      .pipe(gulp.dest('dist'));
}

const build = gulp.series(
  clean,
  compileTS,
  bundle,
  compile);

exports.build = build;
