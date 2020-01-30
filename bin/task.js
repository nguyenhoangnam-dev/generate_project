let gulpData = `const gulp = require('gulp');
const { series, parallel, src, dest } = require('gulp');
const browserSync = require('browser-sync').create();
const image = require('gulp-imagemin');
const htmlReplace = require('gulp-html-replace');
const changed = require('gulp-changed');
const newer = require('gulp-newer');
const size = require('gulp-size');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const urlAdjuster = require('gulp-css-replace-url');
`;

let gulpMinify = `

function minifyImage() {
  return src(['./src/img/**/*', '!./src/img/desktop.ini'])
    .pipe(changed('./docs/img'))
    .pipe(newer('image/'))
    .pipe(
      image([
        image.gifsicle({ interlaced: true }),
        image.mozjpeg({quality: 75, progressive: true}),
        image.optipng({ optimizationLevel: 5 })
      ])
    )
    .pipe(
      size({
        showFiles: true
      })
    )
    .pipe(dest('./docs/img'))
    .pipe(dest('./src/img'));
}

function minifyJs() {
  return src('./src/js/**/*.js')
    .pipe(changed('./docs/js'))
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(uglify())
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(dest('./docs/js'));
}

function minifyCss() {
  return (
    src(['./src/css/*.css'])
      .pipe(changed('./docs/css'))
      .pipe(sourcemaps.init())
      .pipe(
        urlAdjuster({
          replace: ['../../', '../']
        })
      )
      .pipe(autoprefixer())
      .pipe(csso())
      .pipe(
        rename({
          suffix: '.min'
        })
      )
      .pipe(sourcemaps.write('.'))
      .pipe(
        size({
          showFiles: true
        })
      )
      .pipe(dest('./docs/css'))
  );
}

function minifyHtml() {
  return (
    src('./src/**/*.html')
      .pipe(changed('./docs'))
      .pipe(
        htmlReplace({
          css: 'css/main.min.css',
          js: 'js/index.min.js'
        })
      )
      .pipe(dest('./docs'))
  );
}

function fontCopy() {
  return src('./src/font/*')
    .pipe(changed('./docs/font'))
    .pipe(dest('./docs/font'));
}

function libCopy() {
  return src('./src/lib/**/*')
    .pipe(changed('./docs/lib'))
    .pipe(dest('./docs/lib'));
}

function cleanDist() {
  return src('./docs', { read: false }).pipe(clean());
}

exports.watch = watch;
exports.minifyImage = minifyImage;
exports.minifyJs = minifyJs;
exports.minifyCss = minifyCss;
exports.minifyHtml = minifyHtml;
exports.cleanDist = cleanDist;
exports.default = series(
  cleanDist,
  parallel(
    minifyImage,
    parallel(
      minifyJs,
      parallel(minifyCss, parallel(minifyHtml, parallel(fontCopy, libCopy)))
    )
  )
);`;

let taskFile = {
  gulp: {
    data: gulpData,
    minify: gulpMinify
  }
};

module.exports = taskFile;
