const gulp = require('gulp');
const concat = require('gulp-concat'); //Сборка всех файлов в один css файл
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css'); //Сжатие и минимализация css файла
const uglify = require('gulp-uglify');// Минификация кода  js
const del = require('del');
const browserSync = require('browser-sync').create(); //Live reload
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');



const cssFiles = [
    './node_modules/normalize.css/normalize.css',
    './src/scss/*.scss',
    // './src/css/some.css',
    './src/css/style.css',
    './src/css/media.css',
// Сюда можно засунуть порядок подключения файлов и стилей 
// Указывая путь ./src/css/style.css 
// А потом название массива запихнуть в gulp.src(cssFiles);
]

const jsFiles = [
    // './src/js/lib.js',
    './src/js/script.js'
]

function styles () {
    return gulp.src(cssFiles)
                .pipe(sass().on('error', sass.logError))
                .pipe(concat('all.css'))
                .pipe(autoprefixer({
                    browsers: ['> 0.1%'],
                    cascade: false
                }))
                .pipe(cleanCSS({
                    level: 2
                }))
            .pipe(gulp.dest('./build/css'))
            .pipe(browserSync.stream());
}

function scripts () {
    return gulp.src(jsFiles)
        .pipe(concat('all.js'))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}

gulp.task('imagemin', () =>
    gulp.src('src/img/*')
        .pipe(imagemin(
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),))
        .pipe(gulp.dest('./build/img'))
);

function watch () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/css/**/*.css', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./src/scss/**/*.scss', styles);
    gulp.watch("./*.html").on('change', browserSync.reload);
}

function remove() {
   return del(['build/*']);
}

gulp.task('styles', styles)
gulp.task('scripts', scripts)
gulp.task('watch', watch)
gulp.task('del', remove)



gulp.task('build', gulp.series('del', 'imagemin',
                   gulp.parallel(styles, scripts)));