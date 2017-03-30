// CONFIG ________________________________________
var siteUrl = __dirname.split('/pub/')[0].split('/').pop() + '.test'; // use '.test' or .sandbox. I like '.test'


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
var browsersync     = require('browser-sync').create(siteUrl);
    browsersync     = require('browser-sync').get(siteUrl);

var config {
  sass: { // config obj for SASS compilation ------------------------------------------------------------------
    outputStyle: 'compressed', 
    importer: compass
  },
  sassError: function(error) { // custom function for SASS errors (used in task 'sass')
    sass.logError.bind(this)(error);
    browsersync.notify(
      '<pre style="max-width: 600px; text-align: left; margin: 0;">' +
      '<strong style="color: red;">SASS ERROR</strong><br>' + 
      error.formatted +
      '</pre>'
      , 5000);
  },
  browsersync: { // browser sync config obj ------------------------------------------------------------------
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
  },
  autoprefixer: [ // array for autoprefixer config ------------------------------------------------------------
    'last 2 version', 
    'safari 5', 
    'ie 7', 
    'ie 8', 
    'ie 9', 
    'opera 12.1', 
    'ios 6', 
    'android 4'
  ]
}



// ==================================================
// Tasks
// ==================================================

// compile sass and return stream
gulp.task('sass', function () {
  return gulp.src('sass/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass(config.sass).on('error', config.sassError))
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('css'))
    .pipe(browsersync.stream({match: '**/*.css'})); // this line injects style.css
});


// ==================================================
// MAIN TASK 
// ==================================================
gulp.task('default', function(){

  // set up browsersync server
  browsersync.init(config.browsersync);

  // watch for changes on these files
  gulp.watch('sass/**/*.scss', ['sass']);

  // reload on twig changes
  gulp.watch(
    [
      'templates/**/*.twig'
    ], 
    function () {
      browsersync.notify('<span style="color: red;">Twig changes detected</span>, browser refreshing...');
      browsersync.reload();
    });
});