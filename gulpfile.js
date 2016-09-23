var gulp = require('gulp')
  , del  = require('del')
  , browserSync = require('browser-sync')

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
    return gulp.src('app/styles/main.styl')
        .pipe($.sourcemaps.init())
        .pipe($.stylus())
        .pipe($.autoprefixer('last 4 versions'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp'))
        .pipe($.size())
        .pipe(browserSync.stream())
});

gulp.task('build:styles', [ 'styles' ], function () {
  return gulp.src('.tmp/styles')
             .pipe(gulp.dest('dist/styles'))
})

gulp.task('pug', function () {
  return gulp.src(['app/pug/**/*.pug'])
             .pipe($.pug({pretty: true}))
             .pipe(gulp.dest('.tmp'))
             .pipe($.size())
});

gulp.task('build:pug', [ 'pug' ], function () {
  return gulp.src('.tmp/*.html')
             .pipe($.useref())
             .pipe(gulp.dest('dist'))
})

gulp.task('scripts',  function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.size())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.stream())
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

gulp.task('extras', function () {
    return gulp.src('app/*.*', { dot: true })
        .pipe(gulp.dest('.tmp'));
});

gulp.task('clean', function () {
    return del(['.tmp', 'dist'])
});

gulp.task('serve', ['pug', 'styles', 'scripts', 'images'], function () {
  browserSync.init({
    server: {
      baseDir: [ './app', './.tmp' ],
      routes: {
        '/node_modules': './node_modules'
      }
    }
  })
});

gulp.task('watch', ['serve'], function () {
    // watch for changes
    gulp.watch('app/styles/**/*.styl', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch('app/pug/**/*.pug', ['pug']);
    gulp.watch('.tmp/*.html').on('change', browserSync.reload)
});
