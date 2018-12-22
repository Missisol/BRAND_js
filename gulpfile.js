'use strict';

const gulp = require('gulp');
const {watch, series, parallel} = require('gulp');
const less = require('gulp-less');
const path = require('path');
const gulpIf = require('gulp-if');
const del = require('del');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const newer = require('gulp-newer');

const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({browser: ['last 2 version']});

// Транспилируем less в css
gulp.task('less', function () {
  return gulp.src('src/less/*.less', {since: gulp.lastRun('less')})
    .pipe(less({
        paths: [path.join('src/less/_*.less', 'less', 'includes')]
      },
      {
        plugins: [autoprefix]
      }))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({stream: true}));
});

// Обновляем страницу браузера при изменениях
gulp.task('serve', function () {
  browserSync.init({
    server: 'dist',
  });

  // Автоперезагрузк
  browserSync.watch('dist/**/*.*').on('change', browserSync.reload);
});

// Очищаем директорию dist
gulp.task('clean', function () {
  return del('dist');
});

// Оптимизируем файлы (объединяем и сжимаем)
gulp.task('minify', function () {
  return gulp.src('src/*.html', {since: gulp.lastRun('minify')})
    .pipe(newer('dist'))
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', minifyCss()))
    .pipe(gulp.dest('dist'));
});

// Собираем и минимизируем изображения
gulp.task('images:build', function () {
  return gulp.src('src/images/**/*.*', {since: gulp.lastRun('images:build')})
    .pipe(newer('dist/images'))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest('dist/images'));
});

// Переносим шрифты
gulp.task('fonts:build', function () {
  return gulp.src('src/fonts', {since: gulp.lastRun('fonts:build')})
    .pipe(newer('dist/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

// Переносим директорию assets
gulp.task('assets', function () {
  return gulp.src('src/assets/**', {since: gulp.lastRun('assets')})
    .pipe(newer('dist/assets'))
    .pipe(gulp.dest('dist/assets'))
});

gulp.task('watch', function () {
  watch('src/less/*.less', series('less'));

  watch('src/*.html', series('minify'));

  watch('src/assets/**', series('assets'));

  watch('src/images/**/*.*', series('images:build'));

  watch('src/fonts', series('fonts:build'));
});

// Собираем файлы проекта в папку dist
exports.default = series('clean', 'less',
  parallel('minify', 'images:build', 'fonts:build', 'assets'),
  parallel('watch', 'serve'));

