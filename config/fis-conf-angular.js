var fs = require('fs');
var prevPrepackageTime = 0;
var path = require('path');
var colors = require('colors');
var linter = require('lint-plus');
var notifier = require('node-notifier');
var fisParserDefineFun = require('../lib/fis3-parser-define');
var fisParserDefine = function (content, file, conf) {
    return fisParserDefineFun(content, file, fis.xgconfig.defines)
};


var preset2015 = require('babel-preset-es2015');
var presetstage2 = require('babel-preset-stage-2')

var ES6_SUFFIX = 'es6';

let appPath = process.cwd() + '/src/app';
exports.config = function (m) {
    return function () {
        // 启动时默认清除缓存
        fis.compile.clean();

        fis.set('project.ignore', [
                'src/doc/**'
            ])
            .set('project.fileType.text', ES6_SUFFIX)
            .set('project.files', [
                ...fs.readdirSync(appPath)
                .filter(v => v !== 'Modules')
                .map(path =>
                    fs.statSync(appPath + '/' + path).isDirectory() ?
                    ('src/app/' + path + '/**') : 'src/app/' + path),
                ...m.map(v => `src/app/Modules/${v}/**`),
                'src/appDownload/**',
                'src/common/**',
                'src/global/**',
                'src/lib/**',
                'src/index.html',
                'src/transpond-config.js'
            ])
            /* 对css文件需要依赖打包 */
            .match('::package', {
                prepackager: function (ret, conf, settings, opt) {
                    // ret.src 所有的源码，结构是 {'<subpath>': <File 对象>}
                    // ret.ids 所有源码列表，结构是 {'<id>': <File 对象>}
                    // ret.map 如果是 spriter、postpackager 这时候已经能得到打包结果了，
                    //         可以修改静态资源列表或者其他
                    prevPrepackageTime = new Date();
                    var timestamp = new Date().getTime().toString().substr(0, 10);
                    var srcs = ret.src || {};
                    fis.util.map(srcs, function (src, file) {
                        if (src.match(/^\/src\/index.html/)) {
                            file.setContent(
                                file.getContent().replace(/\$\{__maintimestamp__\}/g, '?' + timestamp)
                            );
                        }
                        if (!src.match(/^\/src\/lib/) && src.match(/\.(html|js|json)$/)) {
                            file.setContent(
                                file.getContent().replace(/\$\{__timestamp__\}/g, timestamp)
                            );
                        }
                    });
                },
                packager: fis.plugin('deps-pack', {
                    '/assets/css/style.css': [
                        'src/common/css/style.css:deps',
                        'src/common/css/style.css'
                    ]
                })
            })
            .match('src/app/require.config.json', {
                parser: function (content, file, settings) {
                    var requireConfig = JSON.parse(content);

                    return content.replace(requireConfig.baseUrl, requireConfig.releaseBaseUrl);
                }
            })
            .match('src/(**)', {
                release: '/$1'
            })
            .match('src/**.' + ES6_SUFFIX, {
                rExt: '.js',
                parser: [fis.plugin('babel-6.x', {
                    presets: [preset2015, presetstage2],
                    sourceMaps: true
                }), fisParserDefine]
            })
            .match('src/**.js', {
                parser: [fis.plugin('babel-6.x', {
                    presets: [preset2015, presetstage2],
                    sourceMaps: true
                }), fisParserDefine]
            })
            .match('src/{app,common}/(**)', {
                release: '/assets/$1$2'
            })
            .match('**.{css,html,js,' + ES6_SUFFIX + '}', {
                lint: function (content, file, conf) {
                    // 判断从上次发布后是否修改
                    if (fis.util.mtime(file.fullname) > prevPrepackageTime) {
                        var results = linter.checkSync([file.fullname]);
                        for (var filepath in results) {

                            fis.log.warn(
                                '%s (%s message%s)',
                                colors.yellow(filepath.replace(fis.project.getProjectPath(), '')),
                                results[filepath].length,
                                results[filepath].length > 1 ? 's' : ''
                            );

                            // 增量发布时给出消息提示
                            if (prevPrepackageTime) {
                                notifier.notify({
                                    title: filepath.replace(fis.project.getProjectPath(), ''),
                                    message: results[filepath].length + ' notices! Please check in terminal!',
                                    icon: path.join(__dirname, '../res/logo.png'),
                                    sound: true
                                });
                            }

                            results[filepath].forEach(function (message) {
                                var type = (function () {
                                    var temp = message.severity;
                                    if (temp === 2) {
                                        return colors.red("ERROR");
                                    }
                                    if (temp === 1) {
                                        return colors.yellow('WARN ');
                                    }
                                    return colors.green('INFO ');
                                })();
                                console.log(
                                    '     %s line %s, col %s: %s  %s',
                                    type,
                                    message.line,
                                    message.col,
                                    message.message,
                                    colors.gray(message.rule)
                                );
                            });
                        }
                    }
                }
            })
            .match('src/lib/**', {
                lint: null,
                parser: null
            });

        /**
         * 正式发布的文件处理配置
         */
        var requireConfigPath = fis.xgconfig.requireConfig || '/src/app/require.config.json';
        var requireConfig = fis.util.readJSON(path.join(process.cwd(), requireConfigPath));
        var paths = requireConfig.paths || {};
        var baseUrl = requireConfig.baseUrl || '';
        var releaseBaseUrl = requireConfig.releaseBaseUrl || '';

        // 文件打包通用部分配置
        var pack_config = {
            '/lib/libCombo.js': [
                'src/lib/libCombo.js:deps',
                'src/lib/libCombo.js'
            ],
            '/assets/main.js': [
                'src/app/appInit.js:deps',
                'src/app/appInit.js',
                'src/app/main.js'
            ],
            '/assets/css/style.css': [
                'src/common/css/style.css:deps',
                'src/common/css/style.css'
            ]
        };

        // forced exclued 'angular' and 'jquery' in libCombo, because they are always shim dependency
        if (requireConfig.shim) {
            for (var key in requireConfig.shim) {
                var id = path.join(baseUrl, paths[key] + '.js');
                var releaseId = path.join(releaseBaseUrl, paths[key] + '.js');

                if (pack_config[releaseId] && requireConfig.shim[key].deps) {
                    excluedShimDependency(pack_config[releaseId], requireConfig.shim[key].deps);
                }
            }
        }

        function excluedShimDependency(packArr, depsArr) {
            for (var dep in depsArr) {

                if (paths[depsArr[dep]]) {
                    packArr.push('!' + path.join(baseUrl, paths[depsArr[dep]] + '.js'));

                    if (requireConfig.shim[depsArr[dep]] && requireConfig.shim[depsArr[dep]].deps) {
                        excluedShimDependency(packArr, requireConfig.shim[depsArr[dep]].deps);
                    }
                }
            }
        }

        /* ==========================================================================
         预发布，本地采用正式发布时一样的发布配置
         ========================================================================== */
        setPublish(fis.media('pre'));

        /* ==========================================================================
         发布配置，文件的打包，压缩只有在发布时才进行
         ========================================================================== */
        setPublish(fis.media('pub'))
            .match('src/transpond-config.js', {
                release: false
            })
            .match('*', {
                deploy: fis.plugin('local-deliver', {
                    to: './dist'
                })
            });

        function setPublish(mediaFis) {

            mediaFis.hook('amd', requireConfig);

            // 配置require config paths指定别名文件的module包装，为打包作准备
            for (var key in paths) {
                mediaFis.match(path.join(baseUrl, paths[key] + '.js'), {
                    isMod: true,
                    moduleId: key
                });
            }

            return mediaFis
                // 文件压缩
                .match('**.{js,' + ES6_SUFFIX + '}', {
                    // fis-optimizer-uglify-js 插件进行压缩，已内置
                    optimizer: fis.plugin('uglify-js', {
                        compress: {
                            drop_console: true,
                            drop_debugger: true
                        }
                    })
                })
                .match('**.css', {
                    // fis-optimizer-clean-css 插件进行压缩，已内置
                    optimizer: fis.plugin('clean-css')
                })
                .match('**.png', {
                    // fis-optimizer-png-compressor 插件进行压缩，已内置
                    optimizer: fis.plugin('png-compressor')
                })
                .match('src/app/(**).{js,' + ES6_SUFFIX + '}', {
                    isMod: true,
                    moduleId: '$1'
                })
                .match('src/app/main.js', {
                    isMod: false
                })
                .match('src/lib/**', {
                    optimizer: null
                })
                .match('src/app/Modules/(**).{js,' + ES6_SUFFIX + '}', {
                    isMod: true,
                    moduleId: '$1'
                })
                .match('src/app/Modules/**Ctrl.{js,' + ES6_SUFFIX + '}', {
                    // 直接设置插件属性的值为插件处理逻辑
                    postprocessor: function (content, file, settings) {
                        pack_config[file.release] = [
                            file.id + ':deps',
                            file.id
                        ];

                        return content;
                    }
                })
                .match('::package', {
                    packager: fis.plugin('deps-pack', pack_config)
                });
        }
    }
};