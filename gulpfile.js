// CONFIG ________________________________________
var siteUrl = __dirname.split('/pub/')[0].split('/').pop() + '.test'; // use '.test' or .sandbox. I like '.test'


// REQUIRES ________________________________________
var gulp            = require('gulp');
var plumber         = require('gulp-plumber');
var sass            = require('gulp-sass');
var compass         = require('compass-importer');
var autoprefixer    = require('gulp-autoprefixer');
var sourcemaps      = require('gulp-sourcemaps');
var stylelint       = require('gulp-stylelint');

// var imagemin     = require('gulp-imagemin');
// var pngquant     = require('imagemin-pngquant');

// pass in siteUrl to create a unique instance for multiple instances.
var browsersync     = require('browser-sync').create(siteUrl);
    browsersync     = require('browser-sync').get(siteUrl);

var config = {
  sass: { // config obj for SASS compilation ------------------------------------------------------------------
    outputStyle: 'compressed', 
    importer: compass
  },
  sassError: function(error) { // custom function for SASS errors (used in task 'sass')
    sass.logError.bind(this)(error);
    browsersync.notify(
      '<pre style="max-width: 50%; text-align: left; margin: 0; font-family: Consolas, Andale Mono WT, Andale Mono, Lucida Console, Lucida Sans Typewriter, Monaco, Courier New, Courier, monospace;">' +
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

            // defaults with tweaks
            // display: 'block',
            // padding: '15px',
            // fontFamily: 'Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", Monaco, "Courier New", Courier, monospace',
            // position: 'fixed',
            // fontSize: '0.9em',
            // zIndex: '9999',
            // top: 'auto',
            // right: '0px',
            // bottom: '0px',
            // borderBottomLeftRadius:' 5px',
            // backgroundColor: 'rgb(27, 32, 50)',
            // margin: '0px',
            // color: 'white',
            // textAlign: 'center',
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
  ],
  stylelint: {
    "ignoreFiles": [
      "sass/modules/*.scss",
      "sass/vendors/**/*.scss"
    ],
    "rules": {
      "block-no-empty": true,
      "color-no-invalid-hex": true,
      "declaration-colon-space-after": "always",
      "declaration-colon-space-before": "never",
      "function-comma-space-after": "always",
      "function-url-quotes": "always",
      "property-no-vendor-prefix": true,
      "declaration-block-no-duplicate-properties": true,
      "string-quotes": "single",
      "value-no-vendor-prefix": true,
      "rule-empty-line-before": [ "always-multi-line", 
        { 
          except: ["after-single-line-comment"],
          ignore: ["inside-block"]
        }
      ],
      // "max-empty-lines": 5,
      // "number-leading-zero": "never",
      //"number-no-trailing-zeros": true,
      //"selector-list-comma-space-before": "never",
      //"selector-list-comma-newline-after": "always",
      // "declaration-block-single-line-max-declarations": 1,
      // "no-descending-specificity": true,
      // "block-closing-brace-empty-line-before": "never",
      // "block-opening-brace-space-before": "always",
      // "block-closing-brace-newline-after": "always",
      // "declaration-block-trailing-semicolon": "always",
      // "no-extra-semicolons": true,
      // "selector-combinator-space-before": "always",
      // "selector-combinator-space-after": "always",
      // "selector-list-comma-newline-after": "always",
      // "selector-descendant-combinator-no-non-space": true,
    }
  }
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

gulp.task('lint-scss', function lintCssTask() {
  return gulp
    .src('sass/**/*.scss')
    .pipe(plumber())
    .pipe(stylelint({
      config: config.stylelint,
      //failAfterError: true,
      reporters: [
        {formatter: 'string', console: true}
      ],
      debug: true
    }));
});

// ==================================================
// MAIN TASK 
// ==================================================
gulp.task('default', function(){

  // set up browsersync server
  browsersync.init(config.browsersync);

  // watch for changes on these files
  gulp.watch('sass/**/*.scss', ['lint-scss','sass']);

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