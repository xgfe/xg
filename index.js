var path = require('path');
var fs = require('fs');
var fis = module.exports =  require('fis3');
var logo = require('./lib/logo.js');
// 内置项目config
var XG_CONFIGS = {
    angular: require('./config/fis-conf-angular.js').config,
    vue: require('./config/fis-conf-vue.js').config
}


fis.require.prefixes.unshift('xg');
fis.cli.name = 'xg';
fis.cli.info = require('./package.json');

// 读取目录下.xgconfig文件
var xgconfigPath = path.resolve(process.cwd(), '.xgconfig');
var xgconfig = {};

if (fs.existsSync(xgconfigPath)) {
    xgconfig = JSON.parse(fs.readFileSync(xgconfigPath));
}

// 确定项目类型，默认为angular
if (!xgconfig.type || !xgconfig.type in XG_CONFIGS) {
    xgconfig.type = null;
}

// 版本信息: xg -v
fis.cli.version = function () {
    logo.logLogo();
    console.log('  v' + fis.cli.info.version + '\n');
};

if (xgconfig.type) {

    // 初始化配置文件
    XG_CONFIGS[xgconfig.type]();

    // release help信息: xg release -h
    var release = fis.require('command', 'release');
    release.name += '\n\n Media name'
        + '\n   pre:                      release to xg-server with optimize for finally confirmation'
        + '\n   pub:                      release to ../dist with optimize for online usage';
}


// release 配置文件监测
release.fisRun = release.run;
release.run = function (argv, cli, env) {
    if (!argv.h && !argv.help && !xgconfig.type) {
        fis.log.error('Release must run in the folder containing a .xgconfig file!');
        return ;
    }

    release.fisRun.apply(release, arguments);
};