var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var del = require('del');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var watch = require('gulp-watch');


// Компилируем less в css
gulp.task('less', function() {
  return gulp.src('src/less/*.less')
  .pipe(less({
    paths: [path.join('src/less/_*.less', 'less', 'includes')]
  }))
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.reload({stream: true}));
});

// Добавляем браузерные префиксы
gulp.task('autoprefix', function() {
  return gulp.src('src/less/*.less')
  .pipe(autoprefixer({
    browsers: ['last 2 version'],
    cascade: false
  }))
  .pipe(gulp.dest('src/css'));
});

// Обновляем страницу браузера при изменениях
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'src',
    }
  });
});

// Следим за изменениями в файлах html, js и less
gulp.task('watch:src', ['browserSync'], function() {
  gulp.watch('src/less/*.less', ['less']);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/script/*.js', browserSync.reload);
});

// Очищаем директорию dist
gulp.task('clean', function() {
return del('dist');
});

// Оптимизируем файлы (объединяем и сжимаем)
gulp.task('minify', function() {
  return gulp.src('src/*.html')
  .pipe(useref())
  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulpIf('*.css', minifyCss()))
  .pipe(gulp.dest('dist'));
});

// Собираем картинки
gulp.task('images:build', function() {
  gulp.src('src/images/**/*.*')
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()],
    interlaced: true
  }))
  .pipe(gulp.dest('dist/images/'));
});

// Собираем шрифты
gulp.task('fonts:build', function() {
  gulp.src('src/fonts')
  .pipe(gulp.dest('dist/fonts'));
});

// Собираем файлы проекта в папку dist
gulp.task('build', [
  'minify',
  'images:build',
  'fonts:build',
]);


