// CONFIG ________________________________________
var siteUrl = __dirname.split('/pub/')[0].split('/').pop() + '.sandbox';


// REQUIRES ________________________________________
var gulp            = require('gulp');
var plumber         = require('gulp-plumber');
var sass            = require('gulp-sass');
var compass         = require('compass-importer');
var autoprefixer    = require('gulp-autoprefixer');
var sourcemaps      = require('gulp-sourcemaps');
// var imagemin     = require('gulp-imagemin');
// var pngquant     = require('imagemin-pngquant');

// pass in siteUrl to create a unique instance for multiple instances.
var browserSync     = require('browser-sync').create(siteUrl);
    browserSync     = require('browser-sync').get(siteUrl);



// ==================================================
// Tasks
// ==================================================

// compile sass and return stream
gulp.task('sass', function () {
    return gulp.src('sass/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed', importer: compass}).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream({match: '**/style.css'}));
});



// ==================================================
// MAIN TASK 
// ==================================================
gulp.task('watch', function(){

  // set up browsersync server
  browserSync.init({
    logLevel: 'debug',
    logPrefix: siteUrl,
    open: false,
    proxy: siteUrl,
    host: siteUrl,
    port: 4000,
    // serveStatic: [{
    //     route: ['/build', '/build/css'],
    //     dir: ['./build', './../css']
    // }],
    // serveStaticOptions: {
    //     fallthrough: false
    // }
  });

  // watch for changes on these files
  gulp.watch('sass/**/*.scss', ['sass']);

  // reload on twig changes
  gulp.watch(
    [
      'templates/**/*.twig'
    ], 
    function () {
      browserSync.notify('<span style="color: red;">Twig changes detected</span>, browser refreshing...');
      browserSync.reload();
    });
});