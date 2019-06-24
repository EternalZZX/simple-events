const clean = require('gulp-clean');
const config = require('./config');
const {
  gulp,
  getBuildMeta,
  htmlLoader,
  scriptLoader,
  styleLoader,
  staticLoader,
  historyLoader,
  webpackLoader
} = require('./gulp.conf');

const DEV_PATH = config.developPath;
const BUILD_PATH = config.buildPath;

const buildMeta = getBuildMeta(DEV_PATH);

gulp.task('clean', () => {
  return gulp.src(`${BUILD_PATH}/*`, { read: false })
    .pipe(clean());
});

gulp.task('webpack:dev:desktop', cb => webpackLoader(BUILD_PATH, buildMeta.dev.webpack.desktop)(cb));
gulp.task('webpack:dev:mobile', cb => webpackLoader(BUILD_PATH, buildMeta.dev.webpack.mobile)(cb));
gulp.task('webpack:dev:web', cb => webpackLoader(BUILD_PATH, buildMeta.dev.webpack.web)(cb));
gulp.task('webpack:ol:desktop', cb => webpackLoader(BUILD_PATH, buildMeta.online.webpack.desktop)(cb));
gulp.task('webpack:ol:mobile', cb => webpackLoader(BUILD_PATH, buildMeta.online.webpack.mobile)(cb));
gulp.task('webpack:ol:web', cb => webpackLoader(BUILD_PATH, buildMeta.online.webpack.web)(cb));
gulp.task('webpack:desktop', cb => webpackLoader(BUILD_PATH, buildMeta.webpack.desktop)(cb));
gulp.task('webpack:mobile', cb => webpackLoader(BUILD_PATH, buildMeta.webpack.mobile)(cb));
gulp.task('webpack:web', cb => webpackLoader(BUILD_PATH, buildMeta.webpack.web)(cb));
gulp.task('script:dev:desktop', cb => scriptLoader(BUILD_PATH, buildMeta.dev.desktop)(cb));
gulp.task('script:dev:mobile', cb => scriptLoader(BUILD_PATH, buildMeta.dev.mobile)(cb));
gulp.task('script:dev:web', cb => scriptLoader(BUILD_PATH, buildMeta.dev.web)(cb));
gulp.task('script:ol:desktop', cb => scriptLoader(BUILD_PATH, buildMeta.online.desktop)(cb));
gulp.task('script:ol:mobile', cb => scriptLoader(BUILD_PATH, buildMeta.online.mobile)(cb));
gulp.task('script:ol:web', cb => scriptLoader(BUILD_PATH, buildMeta.online.web)(cb));
gulp.task('script:desktop', cb => scriptLoader(BUILD_PATH, buildMeta.desktop)(cb));
gulp.task('script:mobile', cb => scriptLoader(BUILD_PATH, buildMeta.mobile)(cb));
gulp.task('script:web', cb => scriptLoader(BUILD_PATH, buildMeta.web)(cb));
gulp.task('html:dev:desktop', cb => htmlLoader(BUILD_PATH, buildMeta.dev.desktop)(cb));
gulp.task('html:dev:mobile', cb => htmlLoader(BUILD_PATH, buildMeta.dev.mobile)(cb));
gulp.task('html:dev:web', cb => htmlLoader(BUILD_PATH, buildMeta.dev.web)(cb));
gulp.task('html:ol:desktop', cb => htmlLoader(BUILD_PATH, buildMeta.online.desktop)(cb));
gulp.task('html:ol:mobile', cb => htmlLoader(BUILD_PATH, buildMeta.online.mobile)(cb));
gulp.task('html:ol:web', cb => htmlLoader(BUILD_PATH, buildMeta.online.web)(cb));
gulp.task('html:desktop', cb => htmlLoader(BUILD_PATH, buildMeta.desktop)(cb));
gulp.task('html:mobile', cb => htmlLoader(BUILD_PATH, buildMeta.mobile)(cb));
gulp.task('html:web', cb => htmlLoader(BUILD_PATH, buildMeta.web)(cb));
gulp.task('style:dev:desktop', cb => styleLoader(BUILD_PATH, buildMeta.dev.desktop)(cb));
gulp.task('style:dev:mobile', cb => styleLoader(BUILD_PATH, buildMeta.dev.mobile)(cb));
gulp.task('style:dev:web', cb => styleLoader(BUILD_PATH, buildMeta.dev.web)(cb));
gulp.task('style:ol:desktop', cb => styleLoader(BUILD_PATH, buildMeta.online.desktop)(cb));
gulp.task('style:ol:mobile', cb => styleLoader(BUILD_PATH, buildMeta.online.mobile)(cb));
gulp.task('style:ol:web', cb => styleLoader(BUILD_PATH, buildMeta.online.web)(cb));
gulp.task('style:desktop', cb => styleLoader(BUILD_PATH, buildMeta.desktop)(cb));
gulp.task('style:mobile', cb => styleLoader(BUILD_PATH, buildMeta.mobile)(cb));
gulp.task('style:web', cb => styleLoader(BUILD_PATH, buildMeta.web)(cb));
gulp.task('static:dev:desktop', cb => staticLoader(BUILD_PATH, buildMeta.dev.desktop)(cb));
gulp.task('static:dev:mobile', cb => staticLoader(BUILD_PATH, buildMeta.dev.mobile)(cb));
gulp.task('static:dev:web', cb => staticLoader(BUILD_PATH, buildMeta.dev.web)(cb));
gulp.task('static:ol:desktop', cb => staticLoader(BUILD_PATH, buildMeta.online.desktop)(cb));
gulp.task('static:ol:mobile', cb => staticLoader(BUILD_PATH, buildMeta.online.mobile)(cb));
gulp.task('static:ol:web', cb => staticLoader(BUILD_PATH, buildMeta.online.web)(cb));
gulp.task('static:desktop', cb => staticLoader(BUILD_PATH, buildMeta.desktop)(cb));
gulp.task('static:mobile', cb => staticLoader(BUILD_PATH, buildMeta.mobile)(cb));
gulp.task('static:web', cb => staticLoader(BUILD_PATH, buildMeta.web)(cb));
gulp.task('history', cb => historyLoader(BUILD_PATH)(cb));

const buildTaskSeq = {
  'build:dev:desktop': ['webpack:dev:desktop', 'script:dev:desktop', 'html:dev:desktop', 'style:dev:desktop', 'static:dev:desktop'],
  'build:dev:mobile': ['webpack:dev:mobile', 'script:dev:mobile', 'html:dev:mobile', 'style:dev:mobile', 'static:dev:mobile'],
  'build:dev:web': ['webpack:dev:web', 'script:dev:web', 'html:dev:web', 'style:dev:web', 'static:dev:web'],
  'build:ol:desktop': ['webpack:ol:desktop', 'script:ol:desktop', 'html:ol:desktop', 'style:ol:desktop', 'static:ol:desktop'],
  'build:ol:mobile': ['webpack:ol:mobile', 'script:ol:mobile', 'html:ol:mobile', 'style:ol:mobile', 'static:ol:mobile'],
  'build:ol:web': ['webpack:ol:web', 'script:ol:web', 'html:ol:web', 'style:ol:web', 'static:ol:web'],
  'build:desktop': ['webpack:desktop', 'script:desktop', 'html:desktop', 'style:desktop', 'static:desktop'],
  'build:mobile': ['webpack:mobile', 'script:mobile', 'html:mobile', 'style:mobile', 'static:mobile'],
  'build:web': ['webpack:web', 'script:web', 'html:web', 'style:web', 'static:web']
};

for (const taskName of Object.keys(buildTaskSeq)) {
  gulp.task(taskName, gulp.parallel(...buildTaskSeq[taskName]));
}

module.exports = gulp;
