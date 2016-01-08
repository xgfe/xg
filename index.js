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

fis.cli.version = function() {
    logo.logLogo();
    console.log('  v' + fis.cli.info.version + '\n');
};

// 读取目录下.xgconfig文件
var xgconfigPath = path.resolve(process.cwd(), '.xgconfig');
var xgconfig = {};

if (fs.existsSync(xgconfigPath)) {
    xgconfig = JSON.parse(fs.readFileSync(xgconfigPath));
}

// 确定项目类型，默认为angular
if (!xgconfig.type || !xgconfig.type in XG_CONFIGS) {
    xgconfig.type = 'angular';
}

// 初始化配置文件
XG_CONFIGS[xgconfig.type]();
