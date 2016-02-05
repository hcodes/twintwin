var fs = require('fs'),
    gulp = require('gulp'),
    path = require('path'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    less = require('gulp-less');
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    cleancss = require('gulp-cleancss'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    apBrowsers = {
        browsers: ['ie >= 9', 'Firefox >= 24', 'Chrome >= 26', 'iOS >= 5', 'Safari >= 6', 'Android > 2.3']
    },
    destDir = './dist',
    version = require('./package.json').version;

var paths = {
    css: [
        'src/**/*.less'
    ],
    js: [
        'src/',
        'src/lib',
        'src/pages',
        'src/components',
        'node_modules'
    ]
};

gulp.task('js', function() {
    return browserify('./src/app.js', {
            paths: paths.js
        })
        .bundle()
        .pipe(source('app.js'))
/*        .pipe(uglify({
            output: {ascii_only: true},
            preserveComments: 'some'
        }))*/
        .pipe(gulp.dest(destDir));
});

gulp.task('css', function() {
    return gulp.src(paths.css)
        .pipe(concat('app.css'))
        .pipe(less())
        .pipe(autoprefixer(apBrowsers))
        .pipe(gulp.dest(destDir));
});

gulp.task('watch', function() {
    gulp.watch('src/**/*', ['css', 'js']);
});

gulp.task('default', ['css', 'js']);
