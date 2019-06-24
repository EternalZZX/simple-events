const fs = require('fs');
const path = require('path');
const find = require('find');
const cp = require('child_process');
const shell = require('shelljs');
const inquirer = require('inquirer');
const config = require('./config');

const getEventList = () => {
  const baseDir = path.join(__dirname, '..');
  const reg = new RegExp(`(${config.developPath}/[\\w-]+/(desktop|mobile|web)|${config.historyPath}/(pc|m)/static/[\\w-]+|${config.historyPath}/pc/static/web/[\\w-]+)$`);
  const list = find.dirSync(reg, baseDir);
  const res = {
    [config.developPath]: {
      mobile: new Set(),
      desktop: new Set(),
      web: new Set()
    },
    [config.historyPath]: new Set()
  };
  for (const dir of list) {
    const arr = dir.substring(baseDir.length + 1, dir.length).split('/');
    if (arr.length === 3 && arr[0] === config.developPath) {
      const eventNameArr = arr[1].split('-');
      eventNameArr.length >= 3 && eventNameArr.splice(0, 2);
      res[config.developPath][arr[2]].add(eventNameArr.join('-'));
    } else if ((arr.length === 4 || arr.length === 5)
      && arr[0] === config.historyPath) {
      res[config.historyPath].add(arr[arr.length -1]);
    }
  }
  return res;
};

const makeDir = (baseDir, forders, files, template) => {
  shell.mkdir('-p', forders.map(forder => path.join(baseDir, forder)));
  shell.touch(files.map(file => path.join(baseDir, file)));
  shell.cp(path.join(__dirname, `./template/${template}.ejs`), path.join(baseDir, './index.ejs'));
};

const makeEventDir = (baseDir, device, webpack) => {
  const forders = webpack
    ? ['assets/images', 'assets/scripts', 'assets/styles', 'statics']
    : ['images', 'scripts', 'styles'];
  const files = webpack
    ? ['assets/styles/index.scss', 'index.entry.js']
    : ['styles/index.scss', 'scripts/index.js'];
  const template = webpack ? `${device}-webpack-html` : `${device}-html`;
  makeDir(baseDir, forders, files, template);
};

const makeVueDir = (baseDir, device) => {
  const forders = ['assets/images', 'assets/scripts', 'assets/styles', 'components', 'statics'];
  shell.mkdir('-p', forders.map(forder => path.join(baseDir, forder)));
  shell.touch(path.join(baseDir, 'assets/styles/index.scss'));
  shell.cp(path.join(__dirname, `./template/${device}-vue-html.ejs`), path.join(baseDir, './index.ejs'));
  shell.cp(path.join(__dirname, './template/vue-js.js'), path.join(baseDir, './index.entry.js'));
  shell.cp(path.join(__dirname, './template/vue-component.vue'), path.join(baseDir, './index.vue'));
};

const createEvent = answers => {
  const forderName = `e-${answers.uptime}-${answers.name}`;
  const eventDir = path.join(__dirname, '..', config.developPath, forderName);
  if (['mobile', 'all'].indexOf(answers.device) !== -1) {
    const mobileEventDir = path.join(eventDir, 'mobile');
    answers.mobileFrame === 'vue'
      ? makeVueDir(mobileEventDir, 'mobile')
      : makeEventDir(mobileEventDir, 'mobile', answers.mobileWebpack);
    console.log(`>> [INFO] ${forderName} 活动移动端初始化完成!`);
  }
  if (['desktop', 'all'].indexOf(answers.device) !== -1) {
    const desktopEventDir = path.join(eventDir, 'desktop');
    answers.desktopFrame === 'vue'
      ? makeVueDir(desktopEventDir, 'desktop')
      : makeEventDir(desktopEventDir, 'desktop', answers.desktopWebpack);
    console.log(`>> [INFO] ${forderName} 活动桌面端初始化完成!`);
  }
  if (answers.device === 'web') {
    const webEventDir = path.join(eventDir, 'web');
    const device = answers.name.endsWith('-m') ? 'mobile' : 'desktop';
    answers.webFrame === 'vue'
      ? makeVueDir(webEventDir, device)
      : makeEventDir(webEventDir, device, answers.webWebpack);
    console.log(`>> [INFO] ${forderName} 活动初始化完成!`);
  }
}

const getSchedule = () => {
  const fileDir = path.join(__dirname, '../schedule.json');
  try {
    return JSON.parse(fs.readFileSync(fileDir, 'utf-8'));
  } catch (err) {
    console.error('\033[31m>> [ERROR] schedule.json 解析错误!\033[0m');
    return {};
  }
};

const updateSchedule = (answers, schedule) => {
  const fileDir = path.join(__dirname, '../schedule.json');
  const forderName = `e-${answers.uptime}-${answers.name}`;
  schedule[answers.name] = {
    uptime: `20${answers.uptime.substring(0, 2)}-${answers.uptime.substring(2, 4)}-${answers.uptime.substring(4, 6)}`
  };
  try {
    fs.writeFileSync(fileDir, JSON.stringify(schedule, null, 2), 'utf-8');
    console.log(`>> [INFO] ${forderName} 活动初始化完成!`);
  } catch (err) {
    console.error('\033[31m>> [ERROR] schedule.json 更新失败!\033[0m');
  }
}

const getEventUrl = answers => {
  return `${answers.device !== 'mobile' ? 'pc' : 'm'}/static/${answers.device === 'web' ? 'web/' + answers.name : answers.name}/index.html`;
}

const eventList = getEventList();
const schedule = getSchedule();

const promptList = [{
  type: 'list',
  name: 'device',
  message: '选择活动适配端:',
  choices: [{
    name: '移动端&桌面端',
    value: 'all'
  }, {
    name: '移动端',
    value: 'mobile'
  }, {
    name: '桌面端',
    value: 'desktop'
  }, {
    name: '响应式',
    value: 'web'
  }]
}, {
  type: 'input', 
  name: 'name', 
  message: '初始化活动名称:',
  validate (input, answers) {
    if (input === '') {
      return false;
    }
    if (eventList[config.historyPath].has(input) ||
      (['mobile', 'all'].indexOf(answers.device) !== -1 && eventList[config.developPath].mobile.has(input)) ||
      (['desktop', 'all'].indexOf(answers.device) !== -1 && eventList[config.developPath].desktop.has(input)) ||
      (answers.device === 'web' && eventList[config.developPath].web.has(input))) {
      return '该活动名称已存在!'
    }
    return true;
  }
}, {
  type: 'input', 
  name: 'uptime', 
  message: '初始化活动上线时间:',
  default (answers) {
    if (schedule[answers.name]) {
      const date = schedule[answers.name].uptime;
      return `${date.substring(2, 4)}${date.substring(5, 7)}${date.substring(8, 10)}`;
    }
    return '190101';
  },
  validate (input) {
    if (input === '') {
      return false;
    }
    if (!/\d/.test(input) || input.length !== 6) {
      return '请输入六位数字格式的日期!';
    }
    return true;
  }
}, {
  type: 'list',
  name: 'mobileFrame',
  message: '选择移动端 JavaScript 框架:',
  choices: [{
    name: 'Vue',
    value: 'vue'
  }, {
    name: 'jQuery',
    value: 'jquery'
  }],
  when (answers) {
    return ['mobile', 'all'].indexOf(answers.device) !== -1;
  }
}, {
  type: 'confirm',
  name: 'mobileWebpack',
  message: '是否使用 Webpack 构建活动移动端?',
  default: true,
  when (answers) {
    return ['mobile', 'all'].indexOf(answers.device) !== -1
      && answers.mobileFrame === 'jquery';
  }
}, {
  type: 'list',
  name: 'desktopFrame',
  message: '选择桌面端 JavaScript 框架:',
  choices: [{
    name: 'Vue',
    value: 'vue'
  }, {
    name: 'jQuery',
    value: 'jquery'
  }],
  when (answers) {
    return ['desktop', 'all'].indexOf(answers.device) !== -1;
  }
}, {
  type: 'confirm',
  name: 'desktopWebpack',
  message: '是否使用 Webpack 构建活动桌面端?',
  default: true,
  when (answers) {
    return ['desktop', 'all'].indexOf(answers.device) !== -1
      && answers.desktopFrame === 'jquery';
  }
}, {
  type: 'list',
  name: 'webFrame',
  message: '选择 JavaScript 框架:',
  choices: [{
    name: 'Vue',
    value: 'vue'
  }, {
    name: 'jQuery',
    value: 'jquery'
  }],
  when (answers) {
    return answers.device === 'web';
  }
}, {
  type: 'confirm',
  name: 'webWebpack',
  message: '是否使用 Webpack 构建活动?',
  default: true,
  when (answers) {
    return answers.device === 'web'
      && answers.webFrame === 'jquery';
  }
}];

inquirer.prompt(promptList).then(answers => {
  createEvent(answers);
  updateSchedule(answers, schedule);
  const str = answers.uptime;
  const uptime = new Date(
    `20${str.substring(0, 2)}-${str.substring(2, 4)}-${str.substring(4, 6)} 23:59:59`
  ).getTime();
  const now = new Date().getTime();
  const eventUrl = getEventUrl(answers);
  cp.spawn(
    'cross-env',
    [`EVENT_URL=${eventUrl}`, 'npx', 'gulp', now <= uptime ? 'serve:dev' : 'serve:ol'],
    { stdio:'inherit' }
  );
});
