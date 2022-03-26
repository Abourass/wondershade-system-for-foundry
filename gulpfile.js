const gulp = require('gulp');
const less = require('gulp-less');
const LessAutoprefix = require('less-plugin-autoprefix');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');

const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

const logError = (err) => { console.error(err); };

gulp.task('less', () => gulp
  .src('./styles/src/index.less')
  .pipe(
    less({ plugins: [autoprefix] }).on('error', logError),
  )
  .pipe(
    cssmin().on('error', logError),
  )
  .pipe(rename({ suffix: '.min'}))
  .pipe(gulp.dest(() => './styles/')));

gulp.task(
  'default',
  gulp.series('less', (cb) => {
    gulp.watch('*.less', gulp.series('less'));
    cb();
  }),
);
