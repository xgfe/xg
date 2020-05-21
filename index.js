var path = require('path');
var fs = require('fs');
var fis = require('fis3');
var logo = require('./lib/logo.js');

module.exports = function (m) {
    // 内置项目config
    var XG_CONFIGS = {
        angular: require('./config/fis-conf-angular.js').config(m),
        vue: require('./config/fis-conf-vue.js').config
    };


    fis.require.prefixes.unshift('xg');
    fis.cli.name = 'xg';
    fis.cli.info = require('./package.json');

    // 读取目录下.xgconfig文件
    var xgconfigPath = path.resolve(process.cwd(), '.xgconfig');
    var xgconfig = {};

    if (fs.existsSync(xgconfigPath)) {
        try {
            xgconfig = JSON.parse(fs.readFileSync(xgconfigPath));
        } catch (e) {
            xgconfig = require(xgconfigPath);
        }
    }

    // 全局挂载xgconfig
    fis.xgconfig = xgconfig;

    // 确定项目类型，默认为angular
    if (!xgconfig.type || !xgconfig.type in XG_CONFIGS) {
        xgconfig.type = null;
    }

    // 版本信息: xg -v
    fis.cli.version = function () {
        logo.logLogo();
        console.log('  v' + fis.cli.info.version + '\n');
    };

    // release help信息: xg release -h
    var release = fis.require('command', 'release');

    if (xgconfig.type) {
        // 初始化配置文件
        XG_CONFIGS[xgconfig.type]();
    }

    // add lint commands
    var currentMedia = fis.get('modules.commands', []);
    // [init', 'install', 'release', 'server', 'inspect']
    currentMedia.splice(2, 0, 'lint', 'tag', 'freepack');
    // [init', 'install', 'lint', 'tag', 'freepack', 'release', 'server', 'inspect']

    fis.set('modules.commands', currentMedia);


    // release 配置文件监测
    release.fisRun = release.run;
    release.run = function (argv, cli, env) {
        if (!argv.h && !argv.help && !xgconfig.type) {
            fis.log.error('Release must run in the folder containing a .xgconfig file!');
            return;
        }

        // 增加release mediaType 说明
        if (argv.h || argv.help) {
            release.name += '\n\n Media name' +
                '\n   pre:                      release to xg-server with optimize for finally confirmation' +
                '\n   pub:                      release to ./dist with optimize for online usage';
        }

        release.fisRun.apply(release, arguments);
    };

    return fis;
}