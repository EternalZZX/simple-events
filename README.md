# 活动工程

## npm 命令说明

### 1. 创建新活动目录文件

```shell
npm run init
```  

### 2. 启动 dev server 编译所有

```shell
npm run start
```  

### 3. 启动 dev server 仅编译 src 文件夹下上线日期前的活动，包含上线当日

```shell
npm run dev
```  

### 4. 生产环境编译

```shell
npm run build
```  

## 功能支持

1. 支持 es6 编译  
2. 支持 ejs 模板语法使用  
3. 支持 dev server 自动刷新
4. 支持移动端 px 转换 rem, flexible 适配
5. 支持 sass,scss,less 编译  
6. 支持 js,css,html 生产环境压缩  

## Webpack 构建功能支持

1. 支持 vue 文件编译
2. 支持 es6 编译，支持 import/export  
3. 支持资源打包，hash 命名  
4. 增加项目根目录 common 文件夹'@'别名, e.g. import '@/utils'  
5. 支持多页面活动，多入口文件  

## Webpack 使用

1. 活动目录中包含 *.entry.js 命名的文件，将被识别使用 Webpack 构建  
2. 活动目录中不包含 *.entry.js，将不使用 Webpack  
3. *.entry.js 命名作为 Webpack 入口文件，同名 *.ejs 作为 template 自动插入打包的 JS/CSS bundle  
4. 项目使用 Webpack 打包构建，assets 目录下资源文件不会作为静态文件复制到生产环境  
5. assets 目录下的资源文件需使用 ES6 import 在 index.entry.js 入口文件或其依赖中引入  
6. 未在依赖树中引用的静态文件需放置在 statics 目录下以便复制到生产环境  
