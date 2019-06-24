const path = require('path');
const find = require('find');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const ejs = require('gulp-ejs');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const pxtorem = require('gulp-pxtorem');
const cssmin = require('gulp-clean-css');
const named = require('vinyl-named');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.conf');
const browserSync = require('browser-sync').create();
const proxy = require('http-proxy-middleware');
const config = require('./config');

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';
const baseDir = path.join(__dirname, '..');

const getUptime = eventName => {
  const str = eventName.split('-')[1];
  return new Date(`20${str.substring(0, 2)}-${str.substring(2, 4)}-${str.substring(4, 6)} 23:59:59`).getTime();
}

const getOutputPath = (relEventDir, dir = '') => {
  const pathArr = path.join(relEventDir, dir).split('/');
  pathArr.shift();
  const eventNameArr = pathArr[0].split('-');
  eventNameArr.length >= 3 && eventNameArr.splice(0, 2);
  pathArr[0] = eventNameArr.join('-');
  const device = pathArr.splice(1, 1)[0];
  device === 'web' && pathArr.unshift('web');
  pathArr.unshift('static');
  pathArr.unshift(device === 'mobile' ? 'm' : 'pc');
  return pathArr.join('/');
};

exports.getBuildMeta = dir => {
  const buildMeta = {
    webpack: { desktop: [], mobile: [], web: [] },
    gulp: { desktop: [], mobile: [], web: [] }
  };
  const absDevPath = path.join(baseDir, dir);
  let projects = find.dirSync(/(desktop|mobile|web)$/, absDevPath);
  const events = {};
  for (const project of projects) {
    const arr = project.split('/');
    const eventName = arr[arr.length - 2];
    const device = arr[arr.length - 1];
    if (!events[eventName]) {
      events[eventName] = {};
    }
    events[eventName][device] = true;
    events[eventName][`${device}RelEventDir`] = project.substring(baseDir.length + 1, project.length);
  }
  const enties = find.fileSync(/\.entry\.js$/, absDevPath);
  for (const file of enties) {
    let arr, index, relEventDir, relEntryDir, eventName, uptime, device, entryFileName;
    relEntryDir = file.substring(baseDir.length + 1, file.length);
    arr = relEntryDir.split('/');
    entryFileName = arr.pop().split('.')[0];
    index = arr.findIndex(item => ['desktop', 'mobile', 'web'].indexOf(item) !== -1) + 1;
    arr.splice(index, arr.length - index);
    relEventDir = arr.join('/');
    [, eventName, device] = arr;
    uptime = getUptime(eventName);
    events[eventName][device] = false;
    buildMeta.webpack[device].push({
      eventName, uptime, relEventDir, relEntryDir, entryFileName
    });
  }
  for (const event of Object.keys(events)) {
    const uptime = getUptime(event);
    events[event].desktop && buildMeta.gulp.desktop.push({
      eventName: event, relEventDir: events[event].desktopRelEventDir, uptime
    });
    events[event].mobile && buildMeta.gulp.mobile.push({
      eventName: event, relEventDir: events[event].mobileRelEventDir, uptime
    });
    events[event].web && buildMeta.gulp.web.push({
      eventName: event, relEventDir: events[event].webRelEventDir, uptime
    });
  }
  const now = new Date().getTime();
  buildMeta.dev = {
    webpack: {
      desktop: buildMeta.webpack.desktop.filter(item => now <= item.uptime),
      mobile: buildMeta.webpack.mobile.filter(item => now <= item.uptime),
      web: buildMeta.webpack.web.filter(item => now <= item.uptime)
    },
    gulp: {
      desktop: buildMeta.gulp.desktop.filter(item => now <= item.uptime),
      mobile: buildMeta.gulp.mobile.filter(item => now <= item.uptime),
      web: buildMeta.gulp.web.filter(item => now <= item.uptime)
    }
  };
  buildMeta.online = {
    webpack: {
      desktop: buildMeta.webpack.desktop.filter(item => now > item.uptime),
      mobile: buildMeta.webpack.mobile.filter(item => now > item.uptime),
      web: buildMeta.webpack.web.filter(item => now > item.uptime)
    },
    gulp: {
      desktop: buildMeta.gulp.desktop.filter(item => now > item.uptime),
      mobile: buildMeta.gulp.mobile.filter(item => now > item.uptime),
      web: buildMeta.gulp.web.filter(item => now > item.uptime)
    }
  };
  buildMeta.desktop = buildMeta.webpack.desktop.concat(buildMeta.gulp.desktop);
  buildMeta.mobile = buildMeta.webpack.mobile.concat(buildMeta.gulp.mobile);
  buildMeta.web = buildMeta.webpack.web.concat(buildMeta.gulp.web);
  buildMeta.dev.desktop = buildMeta.dev.webpack.desktop.concat(buildMeta.dev.gulp.desktop);
  buildMeta.dev.mobile = buildMeta.dev.webpack.mobile.concat(buildMeta.dev.gulp.mobile);
  buildMeta.dev.web = buildMeta.dev.webpack.web.concat(buildMeta.dev.gulp.web);
  buildMeta.online.desktop = buildMeta.online.webpack.desktop.concat(buildMeta.online.gulp.desktop);
  buildMeta.online.mobile = buildMeta.online.webpack.mobile.concat(buildMeta.online.gulp.mobile);
  buildMeta.online.web = buildMeta.online.webpack.web.concat(buildMeta.online.gulp.web);
  return buildMeta;
};

exports.htmlLoader = (dir, meta) => {
  const tasks = meta.map(event => {
    const globs =  event.entryFileName
      ? [`${event.relEventDir}/**/statics/**/*.{ejs,html}`, `!/**/_*.{ejs,html}`]
      : [`${event.relEventDir}/**/*.{ejs,html}`, `!/**/_*.{ejs,html}`];
    return () => gulp.src(globs)
      .pipe(ejs({}, { root: baseDir }, { ext: '.html' }))
      .pipe(gulpif(isProd, htmlmin(config.htmlmin)))
      .pipe(rename(data => {
        data.dirname = getOutputPath(event.relEventDir, data.dirname);
      }))
      .pipe(gulp.dest(dir));
  });
  return tasks.length ? gulp.parallel(...tasks) : (cb) => cb();
};

exports.scriptLoader = (dir, meta) => {
  const tasks = meta.map(event => {
    const globs = event.entryFileName
      ? [`${event.relEventDir}/**/statics/**/*.js`, `!/**/_*.js`, `!/**/*.min.js`]
      : [`${event.relEventDir}/**/*.js`, `!/**/_*.js`, `!/**/*.min.js`];
    return () => gulp.src(globs)
      .pipe(babel())
      .pipe(gulpif(isProd, uglify()))
      .pipe(rename(data => {
        data.dirname = getOutputPath(event.relEventDir, data.dirname);
      }))
      .pipe(gulp.dest(dir));
  });
  return tasks.length ? gulp.parallel(...tasks) : (cb) => cb();
};

exports.styleLoader = (dir, meta) => {
  const types = ['css', 'sass', 'less'];
  let tasks = [];
  for (const type of types) {
    tasks = tasks.concat(meta.map(event => {
      const globDict = event.entryFileName ? {
        css: [`${event.relEventDir}/**/statics/**/*.css`, `!/**/_*.css`, `!/**/*.min.css`],
        sass: [`${event.relEventDir}/**/statics/**/*.s{c,a}ss`, `!/**/_*.s{c,a}ss`],
        less: [`${event.relEventDir}/**/statics/**/*.less`, `!/**/_*.less`]
      } : {
        css: [`${event.relEventDir}/**/*.css`, `!/**/_*.css`, `!/**/*.min.css`],
        sass: [`${event.relEventDir}/**/*.s{c,a}ss`, `!/**/_*.s{c,a}ss`],
        less: [`${event.relEventDir}/**/*.less`, `!/**/_*.less`]
      };
      return () => gulp.src(globDict[type])
        .pipe(gulpif(type !== 'css', type === 'less' ? less() : sass()))
        .pipe(gulpif(
          event.relEventDir.endsWith('mobile') || event.relEventDir.endsWith('-m/web'),
          pxtorem(config.pxtorem)
        ))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(gulpif(isProd, cssmin()))
        .pipe(rename(data => {
          data.dirname = getOutputPath(event.relEventDir, data.dirname);
        }))
        .pipe(gulp.dest(dir));
    }));
  }
  return tasks.length ? gulp.parallel(...tasks) : (cb) => cb();
};

exports.staticLoader = (dir, meta) => {
  const tasks = meta.map(event => {
    const globs = event.entryFileName ? [
      `${event.relEventDir}/**/statics/**/*.*`,
      `!/**/_*`,
      `!/**/.*`,
      `!/**/*.{html,ejs,vue,js,css,scss,sass,less}`,
      `${event.relEventDir}/**/statics/**/*.min.js`,
      `${event.relEventDir}/**/statics/**/*.min.css`
    ] : [
      `${event.relEventDir}/**/*.*`,
      `!/**/_*`,
      `!/**/.*`,
      `!/**/*.{html,ejs,vue,js,css,scss,sass,less}`,
      `${event.relEventDir}/**/*.min.js`,
      `${event.relEventDir}/**/*.min.css`
    ];
    return () => gulp.src(globs)
      .pipe(rename(data => {
        data.dirname = getOutputPath(event.relEventDir, data.dirname);
      }))
      .pipe(gulp.dest(dir));
  });
  return tasks.length ? gulp.parallel(...tasks) : (cb) => cb();
};

exports.historyLoader = dir => {
  const getCssPath = dirname => {
    const arr =dirname.split('/');
    arr[arr.length - 1] = 'css';
    return arr.join('/');
  }
  const tasks = [
    () => gulp.src(`${config.historyPath}/**/*.ejs`)
      .pipe(ejs({}, { root: baseDir }, { ext: '.html' }))
      .pipe(rename(data => {
        if (data.basename.endsWith('.htm')) {
          data.basename = data.basename.slice(0, -4);
          data.extname = '.htm';
        }
      }))
      .pipe(gulp.dest(dir)),
    () => gulp.src([`${config.historyPath}/**/*.*`, '!/**/*.{ejs,scss,sass,less}', '!/**/_*'])
      .pipe(gulp.dest(dir)),
    () => gulp.src([`${config.historyPath}/pc/**/*.{scss,sass}`, '!/**/_*'])
      .pipe(sass())
      .pipe(autoprefixer(config.autoprefixer))
      .pipe(rename(data => {
        data.dirname = getCssPath(`pc/${data.dirname}`)
      }))
      .pipe(gulp.dest(dir)),
    () => gulp.src([`${config.historyPath}/m/**/*.{scss,sass}`, '!/**/_*'])
      .pipe(sass())
      .pipe(pxtorem(config.pxtorem))
      .pipe(autoprefixer(config.autoprefixer))
      .pipe(rename(data => {
        data.dirname = getCssPath(`m/${data.dirname}`)
      }))
      .pipe(gulp.dest(dir)),
    () => gulp.src([`${config.historyPath}/pc/**/*.less`, '!/**/_*'])
      .pipe(less())
      .pipe(autoprefixer(config.autoprefixer))
      .pipe(rename(data => {
        data.dirname = getCssPath(`pc/${data.dirname}`)
      }))
      .pipe(gulp.dest(dir)),
    () => gulp.src([`${config.historyPath}/m/**/*.less`, '!/**/_*'])
      .pipe(less())
      .pipe(pxtorem(config.pxtorem))
      .pipe(autoprefixer(config.autoprefixer))
      .pipe(rename(data => {
        data.dirname = getCssPath(`m/${data.dirname}`)
      }))
      .pipe(gulp.dest(dir))
  ];
  return gulp.series(...tasks);
};

exports.webpackLoader = (dir, meta) => {
  const tasks = meta.map(event => {
    return () => gulp.src(event.relEntryDir)
      .pipe(named())
      .pipe(webpack(webpackConfig(event)))
      .pipe(rename(data => {
        data.dirname = getOutputPath(event.relEventDir);
      }))
      .pipe(gulp.dest(dir));
  });
  return tasks.length ? gulp.series(...tasks) : cb => cb();
};

gulp.task('serve:reload', (cb) => {
  browserSync.reload();
  cb();
});

exports.devServer = (server, dirs, tasks) => {
  browserSync.init({
    port: config.devServer.port || 8080,
    server,
    startPath: process.env.EVENT_URL || config.devServer.startPath,
    middleware: [
      proxy(
        pathname => pathname.match(`^/(${config.devServer.apiPrefixes.join('|')})`),
        config.devServer.proxy
      )
    ]
  });
  for (const dir of dirs) {
    gulp.watch(`${dir}/**/*`, gulp.series(...tasks, 'serve:reload'));
  }
};

exports.gulp = gulp;
