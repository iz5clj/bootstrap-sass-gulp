var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync'); //.create();
var concat = require('gulp-concat');
var debug = require('gulp-debug');
var notify = require('gulp-notify');
var size = require('gulp-size');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var panini = require('panini');
var minifyhtml = require('gulp-htmlmin');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

// Check for --production flag
var isProduction = !!(argv.production);

var config = {
  //sassPath: './resources/assets/sass',
  bowerDir: './bower_components',
  images: 'resources/assets/images/**/*'
}

var jsFiles = [
  config.bowerDir + '/jquery/dist/jquery.js',
  //config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/affix.js',
  //config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/alert.js',
  //config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/button.js',
  //config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
  //config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
  //config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
  //config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
  //config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/popover.js',
  //config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
  config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
  //config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
  //config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
  //config.bowerDir + '/motion-ui/dist/motion-ui.js',
  'resources/assets/js/main.js'
]

// Process sass files from resources/sass/styles.scss
// Autoprefix
gulp.task('sass', function() {

  return gulp.src('resources/assets/sass/styles.scss')
    //.pipe(plumber())
    //.pipe($.sourcemaps.init())
    //.pipe(debug({title: 'sass files:'}))
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 8,
      includePaths: [
        config.bowerDir + '/bootstrap-sass/assets/stylesheets',
        config.bowerDir + '/font-awesome/scss'
      ]
    }).on('error', notify.onError(function(error) {
      return 'Sass error: ' + error.message;
    })))
    .pipe(autoprefixer({
      browsers: [
        "Android 2.3",
        "Android >= 4",
        "Chrome >= 20",
        "Firefox >= 24",
        "Explorer >= 8",
        "iOS >= 6",
        "Opera >= 12",
        "Safari >= 6"
      ]
    }))
    .pipe(gulpif(isProduction, cssnano({
      discardComments: {
        removeAll: true
      },
      autoprefixer: false
    })))
    //.pipe($.sourcemaps.write())
    .pipe(gulp.dest('public/assets/css/'))
    //.pipe(debug({title: 'css files:'}))
    .pipe(size({
      showFiles: true
    }))
    .pipe(browserSync.stream());

  //console.log(stream);
});

// Combine all javascript files into one file: js/main.js
gulp.task('javascript', function() {

  return gulp.src(jsFiles)
    //.pipe($.sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(gulpif(isProduction, uglify()))
    //.pipe(gulpif(!isProduction, $.sourcemaps.write()))
    .pipe(gulp.dest('public/assets/js'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(browserSync.stream());
});

// Optimize all images
gulp.task('images', function() {
  return gulp.src(config.images)
    .pipe(cache(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('public/assets/images'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(notify({
      message: 'Images task complete'
    }));
});

// File generator. Using a common layout.
gulp.task('pages', function() {
  gulp.src('resources/assets/views/pages/**/*.{html, hbs, handlebars}')
    .pipe(panini({
      root: 'resources/assets/views/',
      layouts: 'resources/assets/views/layouts/',
      partials: 'resources/assets/views/partials/',
      helpers: 'resources/assets/views/helpers/',
      data: 'resources/assets/views/data/'
    }))
    .pipe(gulpif(isProduction, minifyhtml({
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: false
    })))
    .pipe(gulp.dest('public'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(browserSync.stream());
});

// Run all of the above tasks
gulp.task('build', ['pages', 'sass', 'javascript']);

// Static Server + watching scss, html and javascript files
gulp.task('serve', ['build'], function() {

  browserSync.init({
    server: 'public/'
  });

  gulp.watch("resources/assets/sass/**/*.scss", ['sass']);
  gulp.watch("resources/assets/js/**/*.js", ['javascript']);
  gulp.watch("resources/assets/views/**/*.html", ['pages']);
});

// Copy the file _bootstrap.scss from the original location (in bower directory)
// to resources/assets/scss
gulp.task('copy', function() {
  gulp.src(config.bowerDir + '/bootstrap-sass/assets/stylesheets/_bootstrap.scss')
    .pipe(rename('_bootstrap-custom.scss'))
    .pipe(gulp.dest('resources/assets/sass'));

  gulp.src(config.bowerDir + '/bootstrap-sass/assets/fonts/**/*.*')
    //.pipe(rename('_bootstrap-custom.scss'))
    .pipe(gulp.dest('public/assets/fonts'));
});
