/* .jshint.rc

{
  "undef": true,
  "unused": true,
  "esnext" : true,
  "predef" : ["console", "require"]
}

*/

/* jshint ignore:start */
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel'),
    jshint = require('gulp-jshint'),
    plumber = require('gulp-plumber'),
    map = require('map-stream'),
    colors = require('colors');

var jsReporter = function(file, cb) {
  return map(function(file, cb) {
    if (!file.jshint.success) {
      var warnings = 0, errors = 0;
      console.log('========================================================='.red);
      console.log(' JSHINT LOG:'.bold.red);
      console.log('---------------------------------------------------------');
      file.jshint.results.forEach(function (err) {
        if (err) {
          err.error.code.toString().charAt(0) === 'E' ? errors+=1 : warnings+=1;
          var log = [
            err.error.code.toString().charAt(0) === 'E' ? 'E: '.bold.red : 'W: '.bold.yellow,
            ' File: ' + err.file.toString().bold.green,
            ' line: ' + err.error.line.toString().bold.green,
            ' - ' + err.error.reason.bold.green
          ].join('');
          console.log(log);
        }
      });
      console.log('---------------------------------------------------------');
      console.log(' found '.bold.green + errors.toString().bold.red + ' errors'.bold.red + ' and '.bold.green + warnings.toString().bold.yellow + ' warnings'.bold.yellow);
      console.log('========================================================='.red);
    }
    cb(null, file);
  });
};

// lint
gulp.task('lint', function() {
  return gulp.src('build/*.es6.js')
    .pipe(jshint())
    .pipe(jsReporter());
});

// es6
gulp.task('es6', function() {
  return gulp.src('build/*.es6.js')
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(rename('plugin.js'))
    .pipe(gulp.dest('build/'));
});

gulp.task('watch', function() {
  // Watch .js files
  gulp.watch('build/*.es6.js', ['lint']);
  gulp.watch('build/*.es6.js', ['es6']);
});

gulp.task('dist', function() {
  return gulp.src('build/plugin.js')
    .pipe(rename('jquery.validate-me.js'))
    .pipe(gulp.dest('../dist/'))
    .pipe(rename({ suffix : '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('../dist/'));
})
