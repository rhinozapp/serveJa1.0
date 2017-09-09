//region Include gulp
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    cssmin = require("gulp-clean-css"),
    uglify = require('gulp-uglify'),
    wrap = require("gulp-wrap"),
    autoprefixer = require('gulp-autoprefixer');
//endregion

//region Define base folders public
var src = 'src/',
    dest = 'www/build/',
    bower = 'bower_components/',
    App = 'src/js/app/',
    modules = 'src/js/modules/';

//endregion

//region Define base folders back
var srcBack = 'server/src/',
    destBack = 'server/build/',
    AppBack = 'server/src/js/app/',
    modulesBack = 'server/js/modules/';
//endregion

//region Compile App JS
gulp.task('app', function () {
    console.log('Compiling the Main System.');
    return gulp.src(App + '**/*.js')
    //.pipe(uglify())
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(concat('AppProject.js'))
        .pipe(gulp.dest(dest + 'js'));
});
//endregion

//region Compile Modules JS
gulp.task('modules', function () {
    console.log('Compiling the Modules System.');
    return gulp.src(modules + '**/*.js')
    //.pipe(uglify())
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(concat('modules.js'))
        .pipe(gulp.dest(dest + 'js'));
});
//endregion

//region Compile Vendor JS
gulp.task('vendor', function () {
    console.log('Compiling the Vendor Dependencies.');
    return gulp.src([
        bower + 'ionic/js/ionic.bundle.js',
        /*bower + 'jquery/dist/jquery.js',*/
        bower + 'angular/angular.js',
        bower + 'angular-animate/angular-animate.js',
        bower + 'angular-aria/angular-aria.js',
        bower + 'angular-resource/angular-resource.js',
        bower + 'angular-messages/angular-messages.js',
        bower + 'angular/angular-locale_pt-br.js',

        bower + 'angular-material/angular-material.js',
        bower + 'angular-loading-bar/build/loading-bar.js',

        bower + 'moment/moment.js',
        bower + 'moment/locale/pt-br.js',

        bower + 'angular-ui-router/release/angular-ui-router.js',
        bower + 'ui-router-extras/release/ct-ui-router-extras.js',
        bower + 'angular-ui-router-styles/ui-router-styles.js',
        bower + 'angular-ui-router.stateHelper/statehelper.js',

        bower + 'angularfire/dist/angularfire.min.js',
        bower + 'firebase/dist/firebase.js'
    ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(dest + 'js'));
});
//endregion

//region Compile CSS from Bower modules
gulp.task('css', function () {
    console.log('Compiling the project CSS in Bower');
    return gulp.src([
        bower + 'angular-material/angular-material.css',
        bower + 'angular-loading-bar/build/loading-bar.css'
    ])
        .pipe(concatCss('bowerCssComponents.css'))
        .pipe(gulp.dest(dest + 'css'));
});
//endregion

//region Compile CSS from Scss files
gulp.task('sass', function () {
    console.log('Compiling the project CSS');
    return sass(src + 'sass/**/*.scss')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(dest + 'css'));
});
//endregion

//region Watch for changes in files
gulp.task('watch', function () {
    // Watch App Files
    gulp.watch(App + '**/*.js', ['app']);
    // Watch User Files
    gulp.watch(modules + '**/*.js', ['modules']);
    // Watch .scss files
    gulp.watch(src + 'sass/**/*.scss', ['sass']);
    // Watch vendor files
    gulp.watch(bower + '**/*.js', ['vendor']);
    gulp.watch(bower + '**/*.css', ['css']);
});
//endregion

//region Default Task
gulp.task('default', [
    'vendor',
    'app',
    'modules',
    'sass',
    'css',
    'watch'
]);
//endregion