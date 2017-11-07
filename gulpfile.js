// CONFIG ________________________________________
var siteUrl = __dirname.split('/pub/')[0].split('/').pop() + '.test'; // use '.test' or .sandbox. I like '.test'

// REQUIRES ________________________________________
var gulp            = require('gulp');
var plumber         = require('gulp-plumber');
var sass            = require('gulp-sass');
// var compass         = require('compass-importer');
var bourbon         = require('bourbon').includePaths;
var autoprefixer    = require('gulp-autoprefixer');
var sourcemaps      = require('gulp-sourcemaps');
var stylelint       = require('gulp-stylelint');
var dateTime        = require('node-datetime');

// pass in siteUrl to create a unique instance for multiple instances.
var browsersync     = require('browser-sync').create(siteUrl);
    browsersync     = require('browser-sync').get(siteUrl);


var config = {
  // config obj for SASS compilation --------------------------------------------------------------
  sass: {
    outputStyle: 'compressed',
    includePaths: bourbon
    //importer: compass
  },
  // custom function for SASS errors (used in task 'sass')
  sassError: function(error) {
    sass.logError.bind(this)(error);
    browsersync.notify(
      '<pre style="max-width: 50%; text-align: left; margin: 0; font-family: Consolas, Andale Mono WT, Andale Mono, Lucida Console, Lucida Sans Typewriter, Monaco, Courier New, Courier, monospace;">' +
      '<strong style="color: red;">SASS ERROR</strong><br>' + 
      error.formatted +
      '</pre>', 5000);
  },
  // browser sync config obj ----------------------------------------------------------------------
  browsersync: {
    opts: { 
      logLevel: 'debug',
      logPrefix: siteUrl,
      open: false,
      proxy: siteUrl,
      host: siteUrl,
      port: 4000,
      notify: {
        // override some of the default styling
        styles: {
          fontFamily: 'Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", Monaco, "Courier New", Courier, monospace',
          top: 'auto',
          bottom: '0',
          borderBottomLeftRadius: '0',
          borderTopLeftRadius: '5px'
        }
      },
      // uncomment for static server
      // serveStatic: [{
      //     route: ['/build', '/build/css'],
      //     dir: ['./build', './../css']
      // }],
      // serveStaticOptions: {
      //     fallthrough: false
      // }
    },
    watch: [
      'img/*.*',
      'js/*.js',
      'templates/**/*.twig',   // D8
      'templates/**/*.tpl.php' // D7
    ]
  },
  // autoprefixer config ----------------------------------------------------------------
  autoprefixer: [ 
    'last 2 version', 
    // 'safari 5', 
    // 'ie 7', 
    // 'ie 8', 
    // 'ie 9', 
    // 'opera 12.1', 
    // 'ios 6', 
    // 'android 4'
  ],
  // stylelint config -----------------------------------------------------------------------------
  stylelint: { 
    'ignoreFiles': [
      'sass/modules/*.scss',
      'sass/vendor/**/*.scss',
      'sass/**/_normalize.scss',
      'sass/**/_print.scss',
      'sass/style.scss'
    ],
    'extends': 'stylelint-config-standard',
    'rules': {
      'at-rule-empty-line-before': ['always', {
        except: [
          'after-same-name',
          'blockless-after-same-name-blockless',
          'first-nested',
        ],
        ignore: ['after-comment'],
      }],
      'at-rule-no-unknown': [true, {
        ignoreAtRules: ['include', 'extend']
      }],
      'comment-whitespace-inside': null,
      'no-extra-semicolons': true,
      'number-no-trailing-zeros': null,
      'number-leading-zero': null,
      'property-no-vendor-prefix': true,
      'selector-pseudo-element-colon-notation': null,
    }
  }
};



// ================================================================================================
// Tasks
// ================================================================================================

// lint scss files
gulp.task('lint-scss', function lintCssTask() {
  var currentTime = dateTime.create();
  var formattedDate = currentTime.format('n-d-Y');

  return gulp
    .src('sass/**/*.scss')
    .pipe(plumber())
    .pipe(stylelint({
      config: config.stylelint,
      //failAfterError: true,
      //reportOutputDir: 'reports',
      reporters: [
        // for documentation
        //{ formatter: 'verbose', save: 'stylelint-report-' + formattedDate + '.txt' },

        // for convienence while fixing
        { formatter: 'string', console: false }
      ],
      debug: true
    }));
});

// compile sass and return stream
gulp.task('sass', ['lint-scss'], function () {
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
// MAIN TASKS 
// ==================================================
gulp.task('default', function () {

  // set up browsersync server
  browsersync.init(config.browsersync.opts);

  // watch for changes for SCSS files
  browsersync.watch('sass/**/*.scss', function(event, file) {
    if (event === 'change') {
      console.log('\n[' + event + '] ' + file + '\n');
      gulp.start('sass');
    }
  });

  // reload on file changes for BS watch list set in config.
  browsersync.watch(
    config.browsersync.watch, 
    function (event, file) {
      console.log('\n[' + event + '] ' + file + '\n');
      if (event === 'change') {
        browsersync.notify('<span style="color: red;">' + file + ' ' + event +'</span>, browser refreshing...');
        browsersync.reload();
      }
    });
});

