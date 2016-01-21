var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('hello', function() {
    console.log("Hello world!");
});

gulp.task('sass', function() {
    return gulp.src('app/sass/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/stylesheets'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch('app/sass/*.scss', ['sass']);
    gulp.watch('app/index.html', browserSync.reload);
    gulp.watch('app/scripts/*.js', browserSync.reload);
});

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
    })
});
