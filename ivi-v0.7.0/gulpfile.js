const gulp = require('gulp');
const del = require('del');
const rollup = require('rollup');
const rollupReplace = require('rollup-plugin-replace');
const rollupNodeResolve = require('rollup-plugin-node-resolve');
const closureCompiler = require('google-closure-compiler-js').gulp();

gulp.task('clean', function () {
    return del(['build', 'dist']);
});

gulp.task('bundle', ['clean'], function (done) {
    return rollup.rollup({
        format: 'es6',
        entry: 'src/main.js',
        plugins: [
            rollupNodeResolve(),
            rollupReplace({
                values: {
                    __IVI_DEV__: false,
                    __IVI_BROWSER__: true
                }
            })
        ]
    }).then(function (bundle) {
        return bundle.write({
            format: 'es',
            dest: 'build/bundle.js'
        });
    });
});

gulp.task('build', ['bundle'], function () {
    return gulp.src(['build/bundle.js'])
        .pipe(closureCompiler({
            js_output_file: 'main.js',
            compilation_level: 'ADVANCED',
            language_in: 'ECMASCRIPT6_STRICT',
            language_out: 'ECMASCRIPT5_STRICT',
            use_types_for_optimization: true,
            assume_function_wrapper: true,
            output_wrapper: '(function(){%output%}).call(this);',
            warning_level: 'QUIET',
            rewrite_polyfills: false
        }))
        .pipe(gulp.dest('dist'));
});
