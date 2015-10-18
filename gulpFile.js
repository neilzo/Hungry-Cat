(function(){
  var gulp = require('gulp');
  var $ = require('gulp-load-plugins')({lazy: false});
  var nodemon = require('gulp-nodemon');
  var sourcemaps = require('gulp-sourcemaps');
  var notify = require('gulp-notify');
  var autoprefixer = require('gulp-autoprefixer');
  var minifyCss = require('gulp-minify-css');

  $.livereload();
  $.livereload.listen();

  var paths = {
    index: './client/index.html',
    root: './client',
    html: './client/**/*.html',
    scripts: './client/app/**/*.js',
    app: './client/app/app.js',
    styles: './client/public/*.css'
  };

  gulp.task('default', $.sequence('inject', 'server', 'watch-less', 'watch'));
  gulp.task('js', minifyJS);
  gulp.task('css', minifyCSS);
  gulp.task('watch-less', watchLess);
  gulp.task('server', watchServer);
  gulp.task('watch', startWatch);
  gulp.task('inject', startInject);

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

  function minifyJS() {
    return gulp.src(paths.app)
      .pipe($.uglify())
      .pipe($.rename('app.min.js'))
      .pipe(gulp.dest('./client/app'))
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

  function startWatch() {
    gulp.watch('./client/public/*.css', $.livereload.changed);
    gulp.watch('./client/app/**/*.js', $.livereload.changed);
    gulp.watch('./client/**/*.html', $.livereload.changed);
  }

  function startInject() {
    var target = gulp.src( paths.index );
    var scripts = gulp.src( paths.app, {read: false} );
    var styles = gulp.src( paths.styles, {read: false} );

    return target
      .pipe( $.inject( scripts, {relative: true}) )
      .pipe( $.inject( styles, {relative: true}) )
      .pipe( gulp.dest( paths.root ) );
  }

})();