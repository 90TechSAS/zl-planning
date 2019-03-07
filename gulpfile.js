const annotate = require('gulp-ng-annotate')
const babel = require('gulp-babel')
const browserify = require('browserify')
const browserSync = require('browser-sync').create()
const buffer = require('vinyl-buffer')
const concat = require('gulp-concat')
const gulp = require('gulp')
const minifyHtml = require('gulp-minify-html')
const rename = require('gulp-rename')
const runSequence = require('run-sequence')
const less = require('gulp-less')
const source = require('vinyl-source-stream')
const templateCache = require('gulp-angular-templatecache')
const uglify = require('gulp-uglify')
const sourceMaps = require('gulp-sourcemaps')
const rimraf = require('rimraf')
const path = require('path')

const MODULE_PACKAGE = '90Tech.planning'

gulp.task('js', ['babel'], function () {
  return gulp.src([
    './.tmp/js/**/*.js',
    './.tmp/templates/*.js'
  ])
    .pipe(sourceMaps.init())
    .pipe(annotate({add: true}))
    .pipe(concat('planning.js'))
    .pipe(uglify())
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest('./dist'))
})

gulp.task('templateCache', function () {
  return gulp.src([
    './src/**/*.html'
  ])
    .pipe(minifyHtml({empty: true}))
    .pipe(templateCache('./template.js', {module: MODULE_PACKAGE, standAlone: false, root: '/'}))
    .pipe(gulp.dest('./.tmp/templates'))
    .pipe(browserSync.reload({stream: true}))
})

gulp.task('style', function () {
  return gulp.src('src/**/*.less')
    .pipe(sourceMaps.init())
    .pipe(less())
    .pipe(concat('planning.css'))
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream())
})

gulp.task('default', ['clean-tmp'], function (callback) {
  runSequence(['templateCache', 'style'], 'js', callback)
})

gulp.task('watch', ['default'], function (callback) {
  browserSync.init({
    server: ['demo', 'dist', 'bower_components'],
    files: [
      './src/**/*.js',
      './src/**/*.html',
      './.tmp/**/*.css',
      './dist/**/*.css',
      './dist/**/*.js',
    ],
    injectChanges: true,
    notify: false,
    reloadDelay: 1000,
    reloadDebounce: 2000,
    open: false,
    watchOptions: {
      usePolling: false
    }
  })
  gulp.watch(['./src/**/*.html'], ['default'], callback).on('change', browserSync.reload)
  gulp.watch(['./src/**/*.html', './index.html', './demo/**/*.*']).on('change', browserSync.reload)
  gulp.watch(['./src/**/*.js'], ['js'])
  gulp.watch(['./src/**/*.less'], ['style'])
})

gulp.task('babel', () => {
  return gulp.src(['./src/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('./.tmp/js'))
})

gulp.task('clean-dist', (done) => {
  rimraf(path.join(__dirname, './dist'), done)
})

gulp.task('clean-tmp', ['clean-dist'], (done) => {
  rimraf(path.join(__dirname, './.tmp'), done)
})

gulp.task('commonjs', ['babel'], () => {
  return browserify(['./.tmp/js/index.js']).bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(annotate())
    .pipe(rename('planning.js'))
    .pipe(gulp.dest('./.tmp/build'))
})
