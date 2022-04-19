const gulp = require('gulp');
const less = require('gulp-less');
const LessAutoprefix = require('less-plugin-autoprefix');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');

const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

const logError = (err) => { console.error(err); };

gulp.task('less', () => gulp
  .src('./styles/src/index.less')
  .pipe(sourcemaps.init())
  .pipe(
    less({ plugins: [autoprefix] }).on('error', logError),
  )
  .pipe(cleanCSS({debug: true}, (details) => {
    console.debug(`${details.name}: ${details.stats.originalSize}`);
    console.debug(`${details.name}: ${details.stats.minifiedSize}`);
  }))
  .pipe(sourcemaps.write())
  .pipe(rename({ suffix: '.min'}))
  .pipe(gulp.dest(() => './styles/')));

gulp.task(
  'default',
  gulp.series('less', (cb) => {
    gulp.watch('*.less', gulp.series('less'));
    cb();
  }),
);
