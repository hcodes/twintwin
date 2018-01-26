var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    //rename = require('gulp-rename'),
    //replace = require('gulp-replace'),
    //cleancss = require('gulp-cleancss'),
    //uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    apBrowsers = {
        browsers: ['ie >= 9', 'Firefox >= 24', 'Chrome >= 26', 'iOS >= 5', 'Safari >= 6', 'Android > 2.3']
    },
    destDir = './dist';

var paths = {
    css: [
        'node_modules/show-js-error/dist/show-js-error.css',
        'src/**/*.less'
    ],
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

gulp.task('jsError', function() {
    return gulp.src('node_modules/show-js-error/dist/show-js-error.js')
        .pipe(gulp.dest(destDir));
});

gulp.task('polyfill', function() {
    return gulp.src(paths.polyfill)
        .pipe(concat('polyfill.js'))
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
    gulp.watch('src/**/*', ['css', 'js', 'polyfill']);
});

gulp.task('default', ['css', 'js', 'jsError', 'polyfill']);
