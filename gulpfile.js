const config = require('./build/config');
const gulp = require('./build/gulp.tasks');
const devServer = require('./build/gulp.conf').devServer;

const DEV_PATH = config.developPath;
const HISTORY_PATH = config.historyPath;
const BUILD_PATH = config.buildPath;

const buildTaskSeq = {
  'build:history': ['clean', 'history'],
  'build:dev': ['clean', 'build:dev:desktop', 'build:dev:mobile', 'build:dev:web'],
  'build:ol': ['clean', 'build:ol:desktop', 'build:ol:mobile', 'build:ol:web', 'history'],
  'build': ['clean', 'build:desktop', 'build:mobile', 'build:web', 'history']
};

const serveTaskSeq = {
  'serve:dev:desktop': ['clean', 'build:dev:desktop'],
  'serve:dev:mobile': ['clean', 'build:dev:mobile'],
  'serve:dev:web': ['clean', 'build:dev:web'],
  'serve:ol:desktop': ['clean', 'build:ol:desktop'],
  'serve:ol:mobile': ['clean', 'build:ol:mobile'],
  'serve:ol:web': ['clean', 'build:ol:web'],
  'serve:history': ['build:history'],
  'serve:dev': ['build:dev'],
  'serve:ol': ['build:ol'],
  'serve': ['build'],
};

for (const taskName of Object.keys(buildTaskSeq)) {
  gulp.task(taskName, gulp.series(...buildTaskSeq[taskName]));
}

for (const taskName of Object.keys(serveTaskSeq)) {
  gulp.task(taskName, gulp.series(
    gulp.series(...serveTaskSeq[taskName]),
    () => devServer(BUILD_PATH, [DEV_PATH, HISTORY_PATH], serveTaskSeq[taskName])
  ));
}

gulp.task('default', gulp.parallel('build'));
