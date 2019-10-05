'use strict';

const
    gulp = require('gulp'),
    del = require('del'),
    path = require('path'),
    $ = require('gulp-load-plugins')(),
    alias = require('rollup-plugin-alias'),
    babel = require('rollup-plugin-babel');

const
    browsers = ['ie >= 9', 'Firefox >= 24', 'Chrome >= 26', 'iOS >= 5', 'Safari >= 6', 'Android > 2.3'],
    destDir = './dist',
    paths = {
        css: [
            'node_modules/show-js-error/dist/show-js-error.css',
            'src/**/*.less'
        ],
        mainJs: 'src/app.js',
        js: [
            'src/lib',
            'src/pages',
            'src/components',
            'node_modules'
        ],
        polyfill: [
            'src/polyfill/*.js'
        ]
    };

gulp.task('js', function() {
    return gulp.src(['./src/**/*.js', './node_modules/jstohtml/dist/jstohtml.esm.js'])
        .pipe($.rollup({
            input: paths.mainJs,
            output: { format: 'iife' },
            plugins: [
                alias({
                    resolve: ['.js'],
                    jstohtml: path.resolve('./node_modules/jstohtml/dist/jstohtml.esm.js')
                }),
                babel()
            ]
        }))
        .pipe(gulp.dest(destDir));
});

gulp.task('jsError', function() {
    return gulp.src('node_modules/show-js-error/dist/show-js-error.js')
        .pipe(gulp.dest(destDir));
});

gulp.task('polyfill', function() {
    return gulp.src(paths.polyfill)
        .pipe($.concat('polyfill.js'))
        .pipe(gulp.dest(destDir));
});

gulp.task('css', function() {
    return gulp.src(paths.css)
        .pipe($.concat('app.css'))
        .pipe($.less())
        .pipe($.autoprefixer({browsers}))
        .pipe(gulp.dest(destDir));
});

gulp.task('watch', function() {
    gulp.watch('src/**/*', gulp.series('css', 'js', 'polyfill'));
});

gulp.task('clean', function() {
    return del([ `${destDir}/*` ]);
});

gulp.task('default', gulp.series('clean', 'css', 'js', 'jsError', 'polyfill'));
