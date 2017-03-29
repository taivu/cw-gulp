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


// config obj for SASS compilation
var configSASS = {
  outputStyle: 'compressed', 
  importer: compass
}

// config obj for Browser-Sync init
var configBS = {
  logLevel: 'debug',
  logPrefix: siteUrl,
  open: false,
  proxy: siteUrl,
  host: siteUrl,
  port: 4000,
  // uncomment to customize browser-sync notifications
  // notify: {
  //   styles: {
  //     top: 'auto',
  //     bottom: '0',

  //     margin: '0px',
  //     padding: '10px',
  //     position: 'fixed',
  //     fontSize: '16px',
  //     zIndex: '9999',
  //     borderRadius: '5px 0px 0px',
  //     color: 'white',
  //     textAlign: 'center',
  //     display: 'block',
  //     width: '100%',
  //     backgroundColor: 'rgba(60, 197, 31, 0.75)'
  //   }
  // },
  // uncomment for static server
  // serveStatic: [{
  //     route: ['/build', '/build/css'],
  //     dir: ['./build', './../css']
  // }],
  // serveStaticOptions: {
  //     fallthrough: false
  // }
}


// ==================================================
// Tasks
// ==================================================

// compile sass and return stream
gulp.task('sass', function () {
  return gulp.src('sass/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    //.pipe(sass(configSASS).on('error', sass.logError))
    .pipe(
      sass(configSASS)
      .on('error', function(error) {
        //sass.logError(error);
        console.log(error.messageFormatted);
        browserSync.notify(
          '<pre style="max-width: 600px; text-align: left; margin: 0;">' +
          '<strong style="color: red;">SASS ERROR</strong><br>' + 
          error.formatted +
          '</pre>'
          , 60000);
      }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream({match: '**/style.css'})); // this line injects style.css
});


// ==================================================
// MAIN TASK 
// ==================================================
gulp.task('default', function(){

  // set up browsersync server
  browserSync.init(configBS);

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