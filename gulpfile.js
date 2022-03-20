const gulp = require('gulp');
const less = require('gulp-less');

gulp.task('less', (cb) => {
  gulp
    .src('/styles/src/*.less')
    .pipe(less())
    .pipe(
      gulp.dest(f => `/styles/${f.base}`),
    );
  cb();
});

gulp.task(
  'default',
  gulp.series('less', (cb) => {
    gulp.watch('*.less', gulp.series('less'));
    cb();
  }),
);
