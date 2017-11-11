const gulp = require('gulp');
const del = require('del');
const rollup = require('rollup');
const rollupNodeResolve = require('rollup-plugin-node-resolve');
const rollupAlias = require('rollup-plugin-alias');
const closureCompiler = require('google-closure-compiler').gulp();

gulp.task('clean', function () {
  return del(['build', 'dist']);
});

gulp.task('bundle', ['clean'], function (done) {
  return rollup.rollup({
    input: 'src/main.js',
    plugins: [
      rollupAlias({
        'ivi-vars': __dirname + '/node_modules/ivi-vars/evergreen-browser',
      }),
      rollupNodeResolve(),
    ]
  }).then(function (bundle) {
    return bundle.write({
      format: 'es',
      file: 'build/bundle.js'
    });
  });
});

gulp.task('build', ['bundle'], function () {
  return gulp.src(['build/bundle.js'])
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
