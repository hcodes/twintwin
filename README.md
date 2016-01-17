{
  "name": "double-emojis",
  "version": "0.1.0",
  "author": {
    "name": "Denis Seleznev",
    "email": "hcodes@yandex.ru",
    "url": "https://github.com/hcodes/double"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/hcodes/double.git"
  },
  "homepage": "https://hcodes.github.io/double/",
  "license": "MIT",
  "engines": {
    "node": ">= 0.12"
  },
  "devDependencies": {
    "gulp": "3.9.x",
    "gulp-autoprefixer": "3.1.x",
    "gulp-cleancss": "0.2.x",
    "gulp-concat": "2.6.x",
    "gulp-less": "3.0.x",
    "gulp-rename": "1.2.x",
    "gulp-replace": "^0.5.4",
    "gulp-uglify": "1.5.x",
    "jquery": "^2.1.4",
    "jstohtml": "^1.1.1",
    "jscs": "2.x",
    "jshint": "2.8.x"
  },
  "scripts": {
    "test": "npm run-script gulp && npm run-script jshint && npm run-script jscs && npm run-script mocha-phantomjs",
    "jscs": "./node_modules/.bin/jscs .",
    "jshint": "./node_modules/.bin/jshint .",
    "gulp": "./node_modules/.bin/gulp",
    "dev": "start http-server . && gulp watch"
  },
  "private": true
}
