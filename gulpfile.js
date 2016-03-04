// Inclusion des modules
var gulp = require('gulp'),
    compass = require('gulp-compass'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del');

// Nettoyage du répertoire de distribution
gulp.task('clean', function() {
    return del(['./dist/css', './dist/js']);
});

// Compilation des fichiers SCSS en CSS
gulp.task('compass', function() {
    gulp.src('app/sass/*.scss')
        .pipe(compass({
            config_file: 'config.rb',
            css: 'app/stylesheets',
            sass: 'app/sass'
        }))
        .pipe(gulp.dest('app/stylesheets'));
});

// Compilation du point d'entrée avec toutes ses dépendances
gulp.task('browserify', function() {
    gulp.src('app/js/scripts/app.js')
	.pipe(browserify({
            insertGlobals : true,
	    debug : !gulp.env.production
	}))
	.pipe(gulp.dest('app/js/bundle'))
});

// Distribution du code
gulp.task('dist', ['browserify'], function() {
  return gulp.src('app/js/bundle/app.js')
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});
