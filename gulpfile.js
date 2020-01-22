const gulp = require('gulp'),
  fs = require('fs'),
  jsonModify = require('gulp-json-modify'),
  oldVersion = JSON.parse(fs.readFileSync('./package.json')).version,
  parts = oldVersion.split('.'),
  newVersion = [parts[0], parts[1], parseInt(parts[2]) + 1].join('.');

console.log('Old Version', oldVersion);
console.log('New Version', newVersion);

gulp.task('update-root', function () {
  gulp.src(['./package.json', './package-lock.json'])
      .pipe(jsonModify({
                         key: 'version',
                         value: newVersion
                       }))
      .pipe(gulp.dest('./'));
});

gulp.task('update-version', [
  'update-root'
]);
