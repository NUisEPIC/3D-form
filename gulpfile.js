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
        .pipe(gulp.dest('dist'))
        .pipe($.size())
        .pipe(browserSync.stream())
});

gulp.task('pug', function () {
  return gulp.src(['app/pug/**/*.pug'])
             .pipe($.pug({pretty: true}))
             .pipe($.useref())
             .pipe(gulp.dest('.tmp'))
             .pipe($.size())
});


gulp.task('scripts', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.sourcemaps.init())
        .pipe($.uglify())
        .pipe($.sourcemaps.write())
        .pipe($.size())
        .pipe(gulp.dest('dist'));
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
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return del(['app/**/*.html', 'dist'])
});

gulp.task('build', ['pug', 'images', 'extras']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('serve', ['pug', 'styles', 'scripts', 'images'], function () {
  browserSync.init({
    server: {
      baseDir: [ './dist', './.tmp' ]
    }
  })
});

gulp.task('watch', ['serve'], function () {
    // watch for changes

    gulp.watch([
        'app/scripts/**/*.js',
        'app/images/**/*',
        'app/pug/**/*.pug'
    ])

    gulp.watch('app/styles/**/*.styl', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch('app/pug/**/*.pug', ['pug']);
    gulp.watch('app/*.html').on('change', browserSync.reload)
    gulp.watch('dist/**/*.js').on('change', browserSync.reload)
});
