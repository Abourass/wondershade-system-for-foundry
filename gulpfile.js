const gulp = require('gulp');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('less', (cb) => {
  gulp
    .src('./styles/src/index.less')
    .pipe(less())
    .pipe(
      autoprefixer({ cascade: false }),
    )
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
