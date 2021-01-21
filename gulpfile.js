const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

const sassFiles = [
  'src/sass/*.scss'
];

const jsFiles = [
  'src/js/*.js'
];

function styles(){
  return gulp.src(sassFiles)
    .pipe(sass())
    .pipe(concat('template.css'))
    .pipe(autoprefixer({
      overrideBrowserslist:  ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleanCSS({level: 2}))
    .pipe(gulp.dest('./build/css'))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
}

function scripts(){
  return gulp.src(jsFiles)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
}

function html(){
  return gulp.src('src/*.html')
  .pipe(gulp.dest('./build'));
}

function fonts(){
  return gulp.src('src/fonts/*.*')
  .pipe(gulp.dest('./build/fonts'));
}

function watch(){
  browserSync.init({
        server: {
            baseDir: "src/"
    }
    //tunnel: true
    });
  gulp.watch('src/sass/**/*.scss', styles);
  gulp.watch('src/js/**/*.js', scripts);
  gulp.watch('src/*.html').on('change', browserSync.reload);
}

function image(){
  return gulp.src('src/img/**/*.*')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true
    }))
  .pipe(gulp.dest('./build/img'));
}

function clean(){
  return del(['build/*'])
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('clean', clean);
gulp.task('image', image);
gulp.task('html', html);
gulp.task('fonts', fonts);

/*финальная сборка проекта*/
gulp.task('build', gulp.series('clean', 'html', 'fonts', 'styles', 'scripts', 'image'));

/*сборка с очисткой папки build*/
gulp.task('serve', gulp.series(clean, gulp.parallel(styles, scripts)));

/*запуск проекта в browsersync*/
gulp.task('dev', gulp.series('serve', 'watch'));
