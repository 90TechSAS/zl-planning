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

gulp.task('js', function (done) {
  gulp.series('babel')(()=>{
    return gulp.src([
      './.tmp/js/**/*.js',
      './.tmp/templates/*.js'
    ])
      .pipe(sourceMaps.init({loadMaps: true}))
      .pipe(concat('planning.js'))
      .pipe(uglify())
      .pipe(sourceMaps.write('./'))
      .pipe(gulp.dest('./dist'))
      .on('end', done)
  })
})

gulp.task('templateCache', function (done) {
  return gulp.src([
    './src/**/*.html'
  ])
    .pipe(minifyHtml({empty: true}))
    .pipe(templateCache('./template.js', {module: MODULE_PACKAGE, standAlone: false, root: '/'}))
    .pipe(gulp.dest('./.tmp/templates'))
    .pipe(browserSync.reload({stream: true}))
    .on('end', done)
})

gulp.task('style', function (done) {
  return gulp.src('src/**/*.less')
    .pipe(sourceMaps.init())
    .pipe(less())
    .pipe(concat('planning.css'))
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream())
    .on('end', done)
})

gulp.task('default', function (callback) {
  gulp.series('clean-tmp')(()=>{
    return gulp.series('templateCache', 'style', 'js')(()=>{
      return callback()
    })
  })
})

const watchFuncs = {
  'html-watch': function (done) {
    return gulp.series('default')(done)
  },
  'js-watch': function (done) {
    return gulp.series('js')(done)
  },
  'style-watch': function (done) {
    return gulp.series('style')(done)
  },
}
gulp.task('watch', function (callback) {
  gulp.series('default')(()=>{
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
    gulp.watch(['./src/**/*.html'], watchFuncs['html-watch']).on('change', browserSync.reload)
    gulp.watch(['./src/**/*.html', './index.html', './demo/**/*.*'], watchFuncs['html-watch']).on('change', browserSync.reload)
    gulp.watch(['./src/**/*.js'], watchFuncs['js-watch'])
    gulp.watch(['./src/**/*.less'], watchFuncs['style-watch'])
  })
})

gulp.task('babel', (done) => {
  return gulp.src(['./src/**/*.js'])
    .pipe(sourceMaps.init())
    .pipe(babel())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./.tmp/js'))
    .on('end', done)
})

gulp.task('clean-dist', (done) => {
  rimraf(path.join(__dirname, './dist'), done)
})

gulp.task('clean-tmp', (done) => {
  gulp.series('clean-dist')(()=>{
    rimraf(path.join(__dirname, './.tmp'), done)
  })
})

gulp.task('commonjs', (done) => {
  gulp.series('babel')(()=>{
    return browserify(['./.tmp/js/index.js']).bundle()
      .pipe(source('index.js'))
      .pipe(buffer())
      .pipe(rename('planning.js'))
      .pipe(gulp.dest('./.tmp/build'))
      .on('end', done)
  })
})
