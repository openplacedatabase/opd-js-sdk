var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');
    
gulp.task('default', function(){
  gulp.run('build', 'test');
});

gulp.task('build', function(){
  return gulp.src('src/sdk.js')
    .pipe(concat('sdk.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build'));
}); 
    
gulp.task('test', function(){
  gulp.src('test/*')
    .pipe(mocha());
});