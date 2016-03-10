// Inclusion des modules
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    stylish = require('jshint-stylish'),
    del = require('del');

// Nettoyage du répertoire de distribution
gulp.task('clean', function() {
    return del(['./dist/css', './dist/js']);
});

// Compilation des fichiers SCSS en CSS
gulp.task('compass', function() {
    gulp.src('app/sass/*.scss')
        .pipe(plugins.compass({
            config_file: 'config.rb',
            css: 'app/stylesheets',
            sass: 'app/sass'
        }))
        .pipe(gulp.dest('app/stylesheets'));
});

// Compilation du point d'entrée avec toutes ses dépendances
gulp.task('browserify', function() {
    gulp.src('app/js/scripts/app.js')
      .pipe(plugins.browserify({
        insertGlobals : true,
        debug : !gulp.env.production
       }))
      .pipe(gulp.dest('app/js/bundle'));
});

// Minification du code
gulp.task('uglify', ['browserify'], function() {
  return gulp.src('app/js/bundle/app.js')
    .pipe(plugins.rename('app.min.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('./dist/js'));
});

// Documentation du code
gulp.task('doc', function() {
    gulp.src("app/js/modules/*.js")
      .pipe(plugins.yuidoc.parser())
      .pipe(plugins.yuidoc.generator())
      .pipe(gulp.dest('./doc'))
      .pipe(plugins.open({uri: 'http://localhost:8000/doc/index.html'}));
});

// Validation du code HTML
gulp.task('htmlhint', function() {
    gulp.src('app/index.html')
      .pipe(plugins.htmlhint())
      .pipe(plugins.htmlhint.failReporter());
});

// Validation du code CSS
gulp.task('csslint', function() {
    gulp.src('app/stylesheets/*.css')
      .pipe(plugins.csslint())
      .pipe(plugins.csslint.reporter());
});

// Validation du code JavaScript
gulp.task('jshint', function() {
    return gulp.src(['app/js/modules/*.js', 'app/js/scripts/*.js'])
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('jshint-stylish'));
});

// Validation de tout le code
gulp.task('lint', ['htmlhint', 'csslint', 'jshint']);

// Tests unitaires
gulp.task('qunit', function() {
    gulp.src('test/unitTesting/tests.js')
      .pipe(plugins.browserify({
        insertGlobals : true,
        debug : !gulp.env.production
       }))
      .pipe(gulp.dest('./test/unitTesting/bundle'))
      .pipe(plugins.open({uri: 'http://localhost:8000/test/unitTesting/test.html'}));
});

// Tests fonctionnels
gulp.task('casperjs', function() {
    gulp.src('test/functionalTesting/tests.js')
      .pipe(plugins.casperjs());
});

// Tous les tests
gulp.task('test', ['qunit', 'casperjs']);

// Compilations automatiques
gulp.task('watch', function() {
    gulp.watch('app/sass/*.scss', ['compass']);
    gulp.watch(['app/js/modules/*.js','app/js/scripts/*.js'], ['browserify']);
});
