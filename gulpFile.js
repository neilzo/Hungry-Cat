(function(){
  var gulp = require('gulp');
  var $ = require('gulp-load-plugins')({lazy: false});
  var nodemon = require('gulp-nodemon');
  var sourcemaps = require('gulp-sourcemaps');
  var notify = require('gulp-notify');
  var autoprefixer = require('gulp-autoprefixer');
  var minifyCss = require('gulp-minify-css');

  var paths = {
    index: './client/index.html',
    root: './client',
    html: './client/**/*.html',
    scripts: './client/app/**/*.js',
    app: './client/app/app.js',
    styles: './client/public/core.css'
  };

  gulp.task('default', $.sequence('server', 'watch-less'));
  gulp.task('css', minifyCSS);
  gulp.task('watch-less', watchLess);
  gulp.task('server', watchServer);

  gulp.task('less', function() {
    return gulp.src('./less/core.less')
      .pipe(sourcemaps.init())
      .pipe($.less())
      .on('error', notify.onError({
        message: 'Error: <%= error.message %>',
        title: 'LESS Compile Error'
      }))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./client/public'));
  });

  function minifyCSS() {
    return gulp.src(paths.styles)
      .pipe(minifyCss())
      .pipe($.rename('core.min.css'))
      .pipe(gulp.dest('./client/public'))
      .once('end', function() {
        process.exit();
      });
  }

  function watchLess() {
    return gulp.watch('./less/**/*.less', ['less']);
  }

  function watchServer() {
    nodemon({
      script: 'server.js',
      ext: 'js',
      watch: ['server.js'],
      env: { 'NODE_ENV': 'development' }
    });
  }

})();
