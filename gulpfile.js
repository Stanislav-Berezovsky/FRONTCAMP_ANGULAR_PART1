var gulp = require('gulp'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
	sequence = require('run-sequence');
    webserver = require('gulp-webserver');

var jsSrc = './src/**/*.js';

gulp.task('webserver', function() {
    gulp.src('./dist/')
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

gulp.task('jshint-app', function () {
	return gulp.src(jsSrc)
		.pipe(jshint())
		.pipe(jshint.reporter('default', {verbose: true}))
		.pipe(jshint.reporter('fail'));
});

gulp.task('concat-allJs', function () {
	return gulp.src(jsSrc)
		.pipe(concat('all.js'))
		.pipe(gulp.dest('./dist/js/'));
});

gulp.task('watch-app', function () {
	gulp.watch(jsSrc, ['jshint-app','concat-allJs']);
});

gulp.task('run', function (cb) {
	return sequence(
		'jshint-app',
		'concat-allJs',
		['webserver','watch-app'],
		cb
	);
});