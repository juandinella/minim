var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useref = require('gulp-useref'); 
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'src'
    }
  })
})


gulp.task('sass', function() {
  return gulp.src('src/scss/**/*.scss') 
    .pipe(sass())
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(gulp.dest('src/css')) 
    .pipe(browserSync.reload({ 
      stream: true
    }));
})


// Watchers
gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/*.html', browserSync.reload); 
  gulp.watch('src/js/**/*.js', browserSync.reload); 
})


// Optimizing CSS and JavaScript 
gulp.task('useref', function() {
  var assets = useref.assets();

  return gulp.src('src/*.html')
    .pipe(assets)
    .pipe(gulpIf('*.css', minifyCSS()))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});

// Optimizing Images 
gulp.task('images', function() {
  return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(cache(imagemin({
      interlaced: true,
    })))
  .pipe(gulp.dest('dist/images'))
});

// Copying fonts 
gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

// Cleaning 
gulp.task('clean', function(callback) {
  del('dist');
  return cache.clearAll(callback);
})

gulp.task('clean:dist', function(callback) {
  del(['dist/**/*', '!dist/images', '!dist/images/**/*'], callback)
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync', 'watch'],
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence('clean:dist', 
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})
