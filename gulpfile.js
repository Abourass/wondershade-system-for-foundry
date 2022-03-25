const gulp = require('gulp');
const less = require('gulp-less');
const LessAutoprefix = require('less-plugin-autoprefix');

const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

gulp.task('less', (cb) => {
  gulp
    .src('./styles/src/index.less')
    .pipe(less({ plugins: [autoprefix] }))
    .pipe(gulp.dest(() => './styles/'));
  cb();
});

gulp.task(
  'default',
  gulp.series('less', (cb) => {
    gulp.watch('*.less', gulp.series('less'));
    cb();
  }),
);
