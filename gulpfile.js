'use strict';

const
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    babel = require('rollup-plugin-babel'),
    commonjs = require('rollup-plugin-commonjs'),
    nodeResolve = require('rollup-plugin-node-resolve');

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
    return gulp.src(paths.mainJs)
        .pipe($.rollup({
            allowRealFiles: true,
            input: paths.mainJs,
            output: { format: 'iife' },
            plugins: [
                nodeResolve({
                    jsnext: true,
                    main: true
                }),
                commonjs({
                    include: 'node_modules/**',  // Default: undefined
                    sourceMap: false,  // Default: true
                    ignore: [ 'conditional-runtime-dependency' ]
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
    gulp.watch('src/**/*', ['css', 'js', 'polyfill']);
});

gulp.task('default', ['css', 'js', 'jsError', 'polyfill']);
