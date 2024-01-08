let enviroment = process.env.NODE_ENV || 'development';
// 默认文件夹配置 .bui为临时babel编译的临时文件, mac上是隐藏文件夹, 实际打包应该为 dist 目录里面的
const folder = {
    src: 'src',
    dist: 'dist',
    temp: '.bui'
}

const gulp = require('gulp');
const {
    task,
    dest,
    src,
    series
} = require('gulp');
// 压缩包
const zip = require('gulp-zip');
// ES6 转ES5
const babel = require('gulp-babel');
// 打包es6
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const stream = require('vinyl-source-stream');

// 任务流
const es = require('event-stream');
// 文件读取
// const fs = require('fs');
// 读写保存配置
const fs = require("fs-extra");
const join = require('path').join;

// 生成css,js map图
const sourcemaps = require('gulp-sourcemaps');
// 错误处理
const plumber = require('gulp-plumber');
// html压缩
const htmlmin = require('gulp-htmlmin');
// 图片压缩
// const imagemin = require('gulp-imagemin');
// less 编译
const less = require('gulp-less');
const minifycss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
// 脚本压缩
const uglify = require('gulp-uglify');
// 跨域代理
const proxy = require('http-proxy-middleware');
// 配合fs
const path = require("path");
// 配合watch增删改
const watch = require('gulp-watch');
// 只修改改动的文件
const changed = require('gulp-changed');
// 生成样式脚本?的引入
const md5 = require('gulp-md5-assets');
// 删除文件
const del = require('del');

// 加入二维码
const qrcode = require('qrcode-terminal');
// 用于获取本机信息
const os = require('os');
const ip = getNetwork()["en0:1"] || "localhost";
// 读取配置
const package = require('./package.json');
// 起服务
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// 获取package的项目配置,支持多个项目配置
var configName = package['projects'] && package['projects'][process.env.NODE_ENV] || 'app.json';
var app = require("./" + configName),
    // 编译服务配置
    distServer = app.distServer || {},
    // 开发服务配置
    devServer = app.devServer || {},
    // 实时刷新,仅在开发模式
    isDevLivereload = devServer.livereload == false ? false : true,
    // 实时刷新,仅在编译模式
    isDistLivereload = distServer.livereload == false ? false : true,
    // 源文件目录
    sourcePath = process.env.NODE_ENV ? process.env.NODE_ENV + '/' + folder.src : folder.src,
    // 源文件目录
    sourceBuild = process.env.NODE_ENV ? process.env.NODE_ENV + '/' + folder.dist : folder.dist;
// 源文件es5缓存目录
sourceTemp = process.env.NODE_ENV ? process.env.NODE_ENV + '/' + folder.temp : folder.temp;


// 配置编译的服务
var config = {
    source: {
        // 源文件目录
        root: sourcePath,
        // 源文件样式目录
        css: [sourcePath + "/css/**/*.css"],
        // style.css 源文件目录
        scss: [sourcePath + '/scss/**/*.scss'],
        // style.css 源文件目录
        less: [sourcePath + '/less/**/*.less', '!' + sourcePath + '/less/**/_*.less'],
        // 源文件图片目录
        images: [sourcePath + '/**/*.{png,jpg,gif,ico}'],
    },
    // 编译的输出路径
    build: sourceBuild,
    // 输出配置
    output: {
        // 输出的根目录
        root: sourceBuild,
        // 输出的样式目录
        css: sourceBuild + '/css',
        images: sourceBuild + '/'
    },
    watcher: {
        rootRule: sourcePath + '/**',
        moveRule: [sourcePath + '/**', '!' + sourcePath + '/scss', '!' + sourcePath + '/less'],
        jsRule: [sourcePath + '/**/*.js', '!' + sourcePath + '/js/bui.js', '!' + sourcePath + '/js/zepto.js', '!' + sourcePath + '/js/platform/**/*.js', '!' + sourcePath + '/js/plugins/**/*.js', '!' + sourcePath + '/**/*.min.js', '!' + sourcePath + '/**/*.json','!' + sourcePath + '/js/cordova/**/*.js'],
        htmlRule: [sourcePath + '/**/*.html'],
    }
}


// 增加用户配置的忽略文件
if ("ignored" in app) {
    app.ignored.forEach(function (item, index) {
        var type = item.substr(item.lastIndexOf(".") + 1);
        switch (type) {
            case "css":
                config.source.css.push(item);
                break;
            case "scss":
                config.source.scss.push(item);
                break;
            case "less":
                config.source.less.push(item);
                break;
            case "png":
            case "jpg":
            case "gif":
            case "jpeg":
                config.source.images.push(item);
                break;
            case "js":
                config.watcher.jsRule.push(item);
                break;
            case "html":
                config.watcher.htmlRule.push(item);
                break;
            default:
                config.watcher.moveRule.push(item);
                break;
        }
    })
}

// 获取本机IP
// 获取ip
// 局域网ip：iptable["en0:1"]
// 本机ip：iptable["lo0"]
function getNetwork() {
    let iptable = {},
        ifaces = os.networkInterfaces();

    for (let dev in ifaces) {
        ifaces[dev].forEach(function (details, alias) {
            if (details.family == 'IPv4') {
                iptable[dev + (alias ? ':' + alias : '')] = details.address;
                iptable["ip"] = details.address;
            }
        });
    }

    return iptable;
}



// 获取随机端口
function getRandomPort() {
    let random = Math.random() * 10000 + 2000;
    let randomPort = parseInt(random);

    return randomPort;
}

// 获取端口并写入配置
function getServerPort() {

    // 开发版运行端口
    let devPort = getRandomPort();
    // 编译版运行端口
    let distPort = devPort + 2;
    // 写入端口
    if (!devServer.port) {
        app.devServer.port = devPort;
        fs.writeFileSync(path.resolve(configName), JSON.stringify(app, null, 2));
    }
    if (!distServer.port) {
        app.distServer.port = distPort;
        fs.writeFileSync(path.resolve(configName), JSON.stringify(app, null, 2));
    }

    return {
        devPort: app.devServer.port,
        distPort: app.distServer.port
    }
}



// 找到文件进行打包处理
function findSync(startPath) {
    let result = []

    function finder(path) {
        let files = fs.readdirSync(path)
        files.forEach(val => {
            let fPath = join(path, val);
            let stats = fs.statSync(fPath)
            if (stats.isDirectory()) {
                finder(fPath)
            }
            if (stats.isFile() && val.lastIndexOf(".js") > -1 && val.lastIndexOf(".json") < 0) {
                result.push({
                    path: fPath,
                    name: val,
                    relativePath: path.substr(folder.temp.length)
                })
            }
        })

    }
    finder(startPath)
    let res = result.map(item => {
        item.path = item.path.replace(/\\/g, '/')
        return item
    })
    return res
}
// 转es5 部分打包平台的webview对es6不友好,譬如: async await 等
task('babel', cb => {

    let step = src(config.watcher.jsRule)
        .pipe(babel({
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-transform-object-assign']
        }))
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error)
                this.emit('end');
            }
        }))
        .pipe(dest(sourceTemp))
    return step;
})
// 转义并压缩
task('babel-mini', cb => {

    return src(config.watcher.jsRule)
        .pipe(babel({
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-transform-object-assign']
        }))
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error)
                this.emit('end');
            }
        }))
        // 混淆
        .pipe(app.uglify ? uglify({
            "compress": {
                "drop_debugger": true
            },
            "output": {
                "max_line_len": false,
                "comments": /^!/
            },
            "mangle": true
        }) : plumber())
        .pipe(dest(sourceTemp));
})
// 模块化打包
task('browserify', cb => {
    let files = findSync(sourceTemp)

    var task = files.map(entry => {
        // 去除 .temp/ 前缀
        let relativeFile = process.env.NODE_ENV ? sourceBuild + entry.relativePath.substr(5) : folder.dist + entry.relativePath;

        return browserify({
            entries: entry.path,
            debug: false
        })
            .bundle()
            .on('error', function (error) {
                console.log(error.toString())
            })
            .pipe(stream(entry.name))
            .pipe(buffer())
            .pipe(dest(relativeFile))
    })
    // 任务合并
    es.merge.apply(null, task)
    cb() //这一句其实是因为V4不再支持同步任务，所以需要以这种方式或者其他API中提到的方式
})


// 清空文件,在最后构建的时候才加入这部
task('clean-dist', cb => {
    return del([sourceBuild + '/**/*'], cb);
});
// 清空文件,在最后构建的时候才加入这部
task('clean-tmp', cb => {
    return del([sourceTemp], cb);
});

// less 初始化的时候编译, 并生成sourcemap 便于调试
task('less', function () {
    let autoprefixOpt = {}; //参考 https://github.com/postcss/autoprefixer#options

    src([sourcePath + '/pages/**/*.less', '!' + sourcePath + '/pages/**/_*.less'])
        .pipe(less())
        .pipe(app.autoprefixer ? autoprefixer(autoprefixOpt) : plumber())
        .pipe(dest(sourceBuild + "/pages/"))

    return src(config.source.less)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(app.autoprefixer ? autoprefixer(autoprefixOpt) : plumber())
        .pipe(sourcemaps.write('./'))
        .pipe(dest(sourceBuild + "/css"))
        .pipe(dest(sourcePath + "/css"))
});
// less 初始化的时候编译, 并生成sourcemap 便于调试
task('less-build', function (cb) {
    let autoprefixOpt = {}; //参考 https://github.com/postcss/autoprefixer#options
    del([sourceBuild + '/css/*.css.map']);

    // 输出单独组件的less文件
    src([sourcePath + '/pages/**/*.less', '!' + sourcePath + '/pages/**/_*.less'])
        .pipe(less())
        .pipe(app.autoprefixer ? autoprefixer(autoprefixOpt) : plumber())
        .pipe(dest(sourceBuild + "/pages/"))

    return src(config.source.less)
        .pipe(less())
        .pipe(app.autoprefixer ? autoprefixer(autoprefixOpt) : plumber())
        .pipe(dest(sourceBuild + "/css"))
        .pipe(dest(sourcePath + "/css"))
});
// css 编译
task('css', function () {
    // 编译style.scss文件
    return src(config.source.css)
        .pipe(changed(sourceBuild + '/css/'))
        .pipe(dest(config.output.css))
})

// 改变的时候才执行压缩
task('css-minify', function () {
    // 编译style.scss文件
    return src(config.source.css)
        .pipe(app.cleancss ? minifycss({
            "compatibility": "ie8"
        }) : plumber())
        .pipe(dest(config.output.css))
})


// move all file except pages/js/** .sass .md
task('move', function () {
    return src(config.watcher.moveRule)
        .pipe(changed(config.watcher.rootRule))
        .pipe(dest(config.output.root));
});

// compress html
task('html', function () {
    var options = {
        "removeComments": true,
        "collapseWhitespace": false,
        "collapseBooleanAttributes": false,
        "removeEmptyAttributes": false,
        "removeScriptTypeAttributes": true,
        "removeStyleLinkTypeAttributes": true,
        "minifyJS": true,
        "minifyCSS": true
    };
    return src(config.watcher.htmlRule)
        .pipe(app.htmlmin ? htmlmin(options) : changed(sourceBuild))
        .pipe(dest(sourceBuild))

});


task('mergeFile', function (cb) {
    // 默认是 "dist/pages"
    findFileMerge(folder.dist + "/" + app.package.folder);

    cb();
});


function getTime() {
    var date = new Date();

    return "" + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
}

task('index-babel-mini', cb => {
    return src(folder.dist + "/index.js")
        .pipe(babel({
            compact: false, // 取消压缩文件超500k提醒
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-transform-object-assign']
        }))
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error)
                this.emit('end');
            }
        }))
        // 混淆
        .pipe(app.uglify ? uglify({
            "compress": {
                "drop_debugger": false
            },
            "output": {
                "max_line_len": false,
                "comments": /^!/
            },
            "mangle": true
        }) : plumber())
        .pipe(dest(folder.temp));
});
// 模块化打包
task('index-browserify', cb => {
    let files = [{
        path: folder.temp + "/index.js",
        name: "index.js",
        relativePath: "index.js",
    }];

    var tag = getTime();
    console.log(folder.dist + `/${folder.dist + tag}.zip 文件创建成功`)
    // 这里需要找到多个文件再进行合并,是异步的, 会造成dist-zip压缩的时候,文件还是没有编译混淆的版本
    var task = files.map(entry => {
        return browserify({
            entries: entry.path,
            debug: false
        })
            .bundle()
            .on('error', function (error) {
                console.log(error.toString())
            })
            .pipe(stream(entry.name))
            .pipe(buffer())
            .pipe(dest(folder.dist))
            .pipe(src(`${folder.dist}/**`))
            .pipe(zip(`${folder.dist + tag}.zip`))
            .pipe(gulp.dest(folder.dist))
    })
    // 任务合并
    es.merge.apply(null, task)
    cb() //这一句其实是因为V4不再支持同步任务，所以需要以这种方式或者其他API中提到的方式
})

// 模块化打包
task('dist-zip', cb => {
    var tag = getTime();
    console.log(`${folder.dist}/${folder.dist + tag}.zip 文件创建成功`)
    return src(`${folder.dist}/**`)
        .pipe(zip(`${folder.dist+tag}.zip`))
        .pipe(gulp.dest(folder.dist))
    cb();
})
// 模块化打包
task('zip', cb => {
    var tag = getTime();
    console.log(`${folder.dist}/${folder.dist + tag}.zip 文件创建成功`)
    return src(`${folder.dist}/**`)
        .pipe(zip(`${folder.dist+tag}.zip`))
        .pipe(gulp.dest(folder.dist))
    cb();
})
task('backup', cb => {
    var tag = getTime();
    return src('src/**')
        .pipe(zip('src' + tag + '.zip'))
        .pipe(gulp.dest('backup'))
    cb();
})

// 找到文件进行打包处理
function findFileMerge(startPath) {
    let results = []
    let startFolder = folder.dist;
    let bundleFile = "index.js"; // 合并到首页

    let indexImports = [];  // 首页用到import的地方

    function finder(path) {
        let files = fs.readdirSync(path)

        files.forEach(val => {
            let fPath = join(path, val);
            let stats = fs.statSync(fPath)
            if (stats.isDirectory()) {
                finder(fPath)
            }
            if (stats.isFile() && val.lastIndexOf(".js") > -1 && val.lastIndexOf(".json") < 0) {
                results.push({
                    path: fPath,
                    name: val,
                    relativePath: path.substr(folder.temp.length)
                })
            }
        })

    }

    // 单独寻找首页匹配 import 
    function findeIndex() {
        let data = fs.readFileSync("src/index.js", 'utf-8');

        // 去掉注释的字符
        let datastr = data.toString().replace(/\/\*[\s\S]*\*\/|^\s*\/\/.*/gm, "");

        let importrule = /import\s[\{|\}]*.+['|;]*/gm;
        let importModules = datastr.match(importrule) || [];

        // 去空格
        importModules = importModules.map((item) => {
            let str = item.replace(/{\s*/g, '{').replace(/\s*}/g, '}').replace(/[\s]*,[\s]/g, ',');

            return str;
        })

        indexImports = [...importModules];

    }
    findeIndex();
    // 查找dist目录
    finder(startPath);


    // 导入的所有依赖模块
    let importAllModules = [];
    let res = results.forEach((item, index) => {

        item.path = item.path.replace(/\\/g, '/');
        let moduleName = item.path.replace(startFolder + "/" + app.package.folder, app.package.folder).replace(".js", "");
        let _moduleName = moduleName;
        // 读取每个文件
        let data = fs.readFileSync(item.path, 'utf-8');

        let datastr = data.toString().replace(/\/\*[\s\S]*\*\/|^\s*\/\/.*/gm, "");
        let templateFile = startFolder + "/" + moduleName + ".html";

        let templateHtml = "";
        // 能否读取模板
        try {
            fs.accessSync(templateFile, fs.constants.R_OK);
            templateHtml = fs.readFileSync(templateFile, "utf-8") || "";
        } catch (err) {
            templateHtml = "";
        }

        // 把html模板变成一个function
        let template = `function(){
					   return ${"\`" + templateHtml + "\`"};
		 }`

        // 匹配 loader.define() 括号里面的内容, 里面有5种书写格式,
        /*
            1. loader.define(function(){});
            2. loader.define("name",function(){});
            3. loader.define("name",["pages/main"],function(main){});
            4. loader.define(["pages/main"],function(main){});
            5. loader.define({
                moduleName:"",
                depend: [],
                loaded: function(){}
            });
        */
        let rule = /(?<=loader\.define\()\s*([\s\S]+)\)/gm;
        let ruleName = /^"([\s\S]+?)",/gm;
        // 前面是数组的时候,loader.define([],function(){});
        let ruleDepend = /[\s,]*(\[[.|\s\S]*?])[,|\s]*?/;
        // 必须出现,前面必须有loader.define("",[],function(){});
        let ruleDepend2 = /[,]+(\[[.|\s\S]*?])[,|\s]*?/;
        let ruleFunction = /(function[\s\S]+\([\s\S]+\})/gm;
        // 提取 loader.define里面的内容
        let datas = rule.exec(datastr) || [];
        // 第2个是返回的值
        let result = datas[1] || "";
        // 获取
        let getRuleName = ruleName.exec(result);
        // 
        moduleName = getRuleName && getRuleName[1] ? (getRuleName[1] || moduleName) : moduleName;
        // 如果入口的配置
        if (_moduleName === app.package.main || item.path === app.package.main) {
            moduleName = "main";
        }
        // 通过import 导入的模块也要进行打包
        // let importrule = /(import[\s\S|.]+from\s+["|'].+?["|'])/gm;
        let importrule = /import\s[\{|\}]*.+['|;]*/gm;
        let importModules = datastr.match(importrule) || [];
        // 当前文件路径
        let apath = item.relativePath.split("/");
        apath[0] = ".";

        // 去空格
        importModules = importModules.map((item) => {
            let str = item.replace(/{\s*/g, '{').replace(/\s*}/g, '}').replace(/[\s]*,[\s]/g, ',');

            return str;
        })

        importModules.forEach(function (el, index) {
            // 有多少个 ../
            let hasRelativePath = el.match(/\.\.\//g) || [];
            let newpath = "";
            for (let i = 0; i < apath.length - hasRelativePath.length; i++) {
                newpath += apath[i] + "/";
            }
            // 把路径处理成相对根路径
            let importfile = el.indexOf("../") > -1 ? el.replace("../", newpath).replace(/\.\.\//g, "") : el.replace("./", "." + item.relativePath + "/");

            // 如果里面有相同，则不导入
            if (importAllModules.includes(importfile) || indexImports.includes(importfile)) {
                return;
            }

            importAllModules.push(importfile);
            fs.appendFileSync(startFolder + '/' + bundleFile, ";" + importfile);
        })

        let hasName = result && (result.indexOf('"') == 0 || result.indexOf("'") == 0);
        let isObject = result && result.indexOf('{') == 0;
        let isArray = result && result.indexOf('[') == 0;
        let isFunctioin = result && result.indexOf('function') == 0;
        if (isObject) {
            // 把值增加到 bundle.js , 这个文件会被首先引用进去, 等于所有模块都已经加载.
            fs.appendFileSync(startFolder + '/' + bundleFile, `;loader.set("${moduleName}",{
						   template:${template}});
						   loader.set("${moduleName}",${result})`,
                'utf8')
            console.log(moduleName + ' 对象模块合并成功');
        } else {

            let newloader = "";
            if (isFunctioin) {
                // 如果是只有回调, result = function(){}
                newloader = `;loader.set("${moduleName}",{
							   template:${template},
							   loaded:${result}});`;
            } else if (hasName || isArray) {
                // 如果有依赖 result = [],function(){}
                // 只有数组开头的时候, loader.define([],function(){}) 或者 loader.define("",[],function(){})
                let depend1 = isArray ? ruleDepend.exec(result) || [] : [];
                let depend2 = hasName ? ruleDepend2.exec(result) || [] : [];
                let depend = isArray ? depend1 : depend2;
                // if( moduleName.indexOf("store/template") > -1){
                // console.log(ruleDepend.exec(result)[1]+"测试")
                // }
                let loaded = ruleFunction.exec(result) || [];
                newloader = `;loader.set("${moduleName}",{
							   template:${template},
							   depend:${depend[1] || []},
							   loaded:${loaded[1]}});`;
            }

            // 把值增加到 bundle.js , 这个文件会被首先引用进去, 等于所有模块都已经加载.
            fs.appendFileSync(startFolder + '/' + bundleFile, newloader, 'utf8')
            console.log(moduleName + ' define模块合并成功');
        }
        if (index === results.length - 1) {
            console.log("合并完成")
        }

    })
    return res
}

// 监测新增
function addFile(file) {
    console.log(file, "added");
    gulp.src(file, {
        base: './' + sourcePath
    }) //指定这个文件
        .pipe(gulp.dest('./' + sourceBuild))
}
// 监测新增


function changeFile(file) {
    console.info(file, "changed");

    let isJs = file.lastIndexOf(".js") > -1 && file.lastIndexOf(".json") < 0;
    let isHtml = file.lastIndexOf(".html") > -1;
    let isScss = file.lastIndexOf(".scss") > -1;
    let isCss = file.lastIndexOf(".css") > -1;
    let isLess = file.lastIndexOf(".less") > -1;
    let autoprefixOpt = {}; //参考 https://github.com/postcss/autoprefixer#options

    // 复制一次文件，再输出一次编译后的文件，避免文件夹未创建导致服务报错
    let relativePath = path.relative('./' + sourcePath, file);
    let distfile = './' + folder.dist + '/' + relativePath;

    try {
        // fs.copySync(file, distfile);

        if (isJs) {
            // 文件单独打包成es5
            browserify(file)
                .transform("babelify", {
                    presets: ["@babel/preset-env"],
                    plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-transform-object-assign']
                })
                .bundle()
                .pipe(fs.createWriteStream(distfile))

            // 刷新
            gulp.src(distfile)
                .pipe(reload({
                    stream: true
                }))

        } else if (isScss) {

            let sassOpt = {
                "outputStyle": "compressed"
            }
            gulp.src(config.source.scss)
                // 生成css对应的sourcemap
                .pipe(sourcemaps.init())
                .pipe(sass(sassOpt).on('error', sass.logError))
                .pipe(app.autoprefixer ? autoprefixer(autoprefixOpt) : plumber())
                .pipe(sourcemaps.write('./'))
                .pipe(dest(sourceBuild + "/css"))
                .pipe(dest(sourcePath + "/css"))
                .pipe(reload({
                    stream: true
                }));

        } else if (isLess) {

            if (file.indexOf("pages/") > -1) {
                // 输出单独组件的less文件

                gulp.src(file)
                    .pipe(less())
                    .pipe(app.autoprefixer ? autoprefixer(autoprefixOpt) : plumber())
                    .pipe(dest(path.dirname(file)))
                    .pipe(reload({
                        stream: true
                    }));
            } else {
                gulp.src(config.source.less)
                    .pipe(sourcemaps.init())
                    .pipe(less())
                    .pipe(app.autoprefixer ? autoprefixer(autoprefixOpt) : plumber())
                    .pipe(sourcemaps.write('./'))
                    .pipe(dest(sourceBuild + "/css"))
                    .pipe(dest(sourcePath + "/css"))
                    .pipe(reload({
                        stream: true
                    }));
            }

        } else if (isHtml) {

            gulp.src(file, {
                base: './' + sourcePath
            })
                .pipe(plumber())
                .pipe(htmlmin(app.htmlmin))
                .pipe(gulp.dest('./' + sourceBuild))
                .pipe(md5(10))
                .pipe(reload({
                    stream: true
                }))
        } else if (isCss) {

            gulp.src(file, {
                base: './' + sourcePath
            })
                .pipe(gulp.dest('./' + sourceBuild))
                .pipe(md5(10, sourceBuild + "/**/*.html"))
                .pipe(reload({
                    stream: true
                }))
        } else {
            gulp.src(file, {
                base: './' + sourcePath
            })
                .pipe(gulp.dest('./' + sourceBuild))
                .pipe(reload({
                    stream: true
                }))
        }
    } catch (e) {
        console.log(e);

    }
}

// 起一个普通服务
task('server', function () {
    var portObj = getServerPort();

    let proxys = [];
    if ("proxy" in app) {
        let proxyObj = app["proxy"];
        let keys = Object.keys(proxyObj);

        keys.forEach(function (item, i) {
            let proxyItem = proxy(item, proxyObj[item])
            proxys.push(proxyItem);
        })
    }

    // 起一个同步服务
    browserSync.init({
        ui: {
            port: portObj.devPort + 1
        },
        server: {
            baseDir: sourceBuild,
            middleware: proxys
        },
        port: portObj.devPort,
        ghostMode: false,
        codeSync: isDevLivereload
    });

    // 插入二维码,手机扫码调试
    var qrurl = "http://" + ip + ":" + portObj.devPort + app.qrcode;
    qrcode.generate(qrurl, {
        small: true
    });

});

// 起一个同步实时修改的服务
task('server-sync', function () {
    var portObj = getServerPort();

    let proxys = [];
    if ("proxy" in app) {
        let proxyObj = app["proxy"];
        let keys = Object.keys(proxyObj);

        keys.forEach(function (item, i) {
            let proxyItem = proxy(item, proxyObj[item])
            proxys.push(proxyItem);
        })
    }

    // 起一个同步服务
    browserSync.init({
        ui: {
            port: portObj.distPort + 1
        },
        server: {
            baseDir: sourceBuild,
            middleware: proxys
        },
        port: portObj.distPort,
        ghostMode: false,
        notify: false,
        codeSync: isDistLivereload,
        // plugins: ['bs-console-qrcode']
    });

    // 插入二维码,手机扫码调试
    var qrurl = "http://" + ip + ":" + portObj.distPort + app.qrcode;

    qrcode.generate(qrurl, {
        small: true
    });
    console.log("手机扫码预览效果");

    // 新增删除由插件负责
    watch(config.watcher.rootRule)
        .on('add', addFile)
        .on('change', changeFile)
        .on('unlink', function (file) {
            //删除文件
            let distFile = './' + sourceBuild + '/' + path.relative('./' + sourcePath, file); //计算相对路径
            fs.existsSync(distFile) && fs.unlink(distFile);
            console.warn(file, "deleted")
        });
});


// 清空缓存, 重新编译
exports.build = series('clean-tmp', 'clean-dist', 'move', 'css-minify', 'html', 'less-build', 'babel-mini', 'browserify') //series是gulpV4中新方法，按顺序执行

// 先编译再起服务,不需要每次都清除文件夹的内容 如果有scss目录,会在最后才生成, 如果没有,则以src/css/style.css 作为主要样式
exports.dev = series('move', 'html', 'css', 'less', 'babel', 'browserify', 'server-sync')
// 打包成一个独立脚本,是否压缩
if (app.package && app.package.uglify) {
    exports.package = series('clean-tmp', 'clean-dist', 'move', 'css-minify', 'html', 'less-build', 'babel-mini', 'browserify', 'mergeFile', 'index-babel-mini', 'index-browserify');
} else {
    exports.package = series('clean-tmp', 'clean-dist', 'move', 'css-minify', 'html', 'less-build', 'babel', 'browserify', 'mergeFile', 'dist-zip');
}