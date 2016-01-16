var fs = require('fs'),
    gulp = require('gulp'),
    path = require('path'),
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
        'src/*.css'
    ],
    js: [
        'src/lib.js',
        'src/app.js',
        'src/levels.js',
        'src/page_*.js'
    ]
};

gulp.task('js', function() {
    return gulp.src(paths.js)
        .pipe(concat('app.js'))
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
    gulp.watch('src/*', ['css', 'js']);
});

gulp.task('default', ['css', 'js']);
