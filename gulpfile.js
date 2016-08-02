var gulp = require('gulp')
  , del  = require('del')

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
    return gulp.src('app/styles/main.styl')
        .pipe($.sourcemaps.init())
        .pipe($.stylus())
        .pipe($.autoprefixer('last 4 versions'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size());
});

gulp.task('jade', function () {
  return gulp.src(['app/jade/**/*.jade'])
             .pipe($.pug({pretty: true}))
             .pipe(gulp.dest('app'));
});


gulp.task('scripts', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.uglify())
        .pipe($.size())
        .pipe(gulp.dest('dist'));
});

gulp.task('html', ['jade', 'styles', 'scripts'], function () {
    return gulp.src('app/*.html')
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
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
    return del(['.tmp', 'dist'])
});

gulp.task('build', ['html', 'images', 'extras']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static('app'))
        .use(connect.static('.tmp'))
        .use(connect.directory('app'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect', 'styles'], function () {
    require('opn')('http://localhost:9000');
});

gulp.task('watch', ['serve', 'jade'], function () {
    var server = $.livereload();

    // watch for changes

    gulp.watch([
        '.tmp/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*',
        'app/jade/**/*.jade'
    ]).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch('app/styles/**/*.styl', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch('app/jade/**/*.jade', ['jade']);
});
