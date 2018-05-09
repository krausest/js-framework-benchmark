const gulp = require('gulp');
const del = require('del');
const rollup = require('rollup');
const rollupNodeResolve = require('rollup-plugin-node-resolve-main-fields');
const closureCompiler = require('google-closure-compiler').gulp();

gulp.task('clean', function () {
  return del(['build', 'dist']);
});

gulp.task('bundle', ['clean'], function (done) {
  return rollup.rollup({
    input: 'src/main.js',
    plugins: [
      rollupNodeResolve({
        mainFields: ['es2016', 'module', 'main'],
      }),
    ]
  }).then(function (bundle) {
    return bundle.write({
      format: 'es',
      file: 'build/bundle.js'
    });
  });
});

gulp.task('build', ['bundle'], function () {
  return gulp.src(['src/env.js', 'build/bundle.js'])
    .pipe(closureCompiler({
      js_output_file: 'main.js',
      compilation_level: 'ADVANCED',
      language_in: 'ECMASCRIPT_2017',
      language_out: 'ECMASCRIPT5_STRICT',
      use_types_for_optimization: true,
      assume_function_wrapper: true,
      isolation_mode: "IIFE",
      warning_level: 'QUIET',
      rewrite_polyfills: false,
      new_type_inf: true
    }))
    .pipe(gulp.dest('dist'));
});
