var gulp = require('gulp');
var compass = require('gulp-compass');

gulp.task('hello', function() {
    console.log("Hello world!");
});

gulp.task('compass', function() {
    gulp.src('app/sass/*.scss')
        .pipe(compass({
            config_file: 'config.rb',
            css: 'app/stylesheets',
            sass: 'app/sass'
        }))
        .pipe(gulp.dest('app/stylesheets'));
});
