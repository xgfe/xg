var prevPrepackageTime = 0;
var path = require('path');
var colors = require('colors');
var linter = require('lint-plus');
var notifier = require('node-notifier');

exports.config = function() {

    fis.set('project.ignore', [
        'src/doc/**'
    ])
        .set('project.files', ['src/**'])
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
                fis.util.map(srcs, function(src, file) {
                    if (src.match(/^\/src\/index.html/)) {
                        file.setContent(
                            file.getContent().replace(/\$\{__maintimestamp__\}/g, '?' + timestamp)
                        );
                    }
                    if (!src.match(/^\/src\/lib/) && src.match(/\.(html|js)$/)) {
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
        .match('src/(**)', {
            release: '/$1'
        })
        .match('src/{app,common}/(**)', {
            release: '/assets/$1$2'
        })
        .match('**.{css,html,js}', {
            lint: function(content, file, conf) {
                // 判断从上次发布后是否修改
                if (fis.util.mtime(file.fullname) > prevPrepackageTime) {
                    var results = linter.checkSync([file.fullname]);
                    for (var filepath in results) {

                        fis.log.warn(
                            '%s (%s message%s)',
                            colors.yellow(filepath.replace(fis.project.getProjectPath(), '')),
                            results[filepath].length,
                            results[filepath].length>1?'s':''
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
                                if(temp === 2){
                                    return colors.red("ERROR");
                                }
                                if(temp === 1){
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
            lint: null
        });


    // 文件打包通用部分配置
    var pack_config = {
        '/assets/main.js': [
            'src/app/app.js',
            'src/app/appCtrl.js',
            'src/app/appInit.js',
            'src/app/main.js'
        ],
        '/assets/Directive/directives.js': [
            'src/app/Directive/directives.js:deps',
            'src/app/Directive/directives.js'
        ],
        '/assets/Factory/factories.js': [
            'src/app/Factory/factories.js:deps',
            'src/app/Factory/factories.js'
        ],
        '/assets/Filter/filters.js': [
            'src/app/Filter/filters.js:deps',
            'src/app/Filter/filters.js'
        ],
        '/assets/Service/services.js': [
            'src/app/Service/services.js:deps',
            'src/app/Service/services.js'
        ],
        '/assets/Router/routers.js': [
            'src/app/Router/routers.js:deps',
            'src/app/Router/routers.js'
        ],
        '/assets/css/style.css': [
            'src/common/css/style.css:deps',
            'src/common/css/style.css'
        ]
    };


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

    /**
     * 正式发布的文件处理配置
     */

    function setPublish(mediaFis) {
        return mediaFis
            // 文件压缩
            .match('**.js', {
                // fis-optimizer-uglify-js 插件进行压缩，已内置
                optimizer: fis.plugin('uglify-js', {
                    compress : {
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
            .hook('amd')
            .match('src/app/(**).js', {
                isMod: true,
                moduleId: '$1'
            })
            .match('src/app/main.js', {
                isMod: false
            })
            .match('src/lib/**', {
                skipDepsAnalysis: true,
                optimizer: null
            })
            // .match('/app/lib.js', {
            //     skipDepsAnalysis: true,
            //     isMod: false,
            //     optimizer: null
            // })
            .match('src/app/Modules/(**).js', {
                isMod: true,
                moduleId: '$1'
            })
            .match('::package', {
                packager: fis.plugin('deps-pack', pack_config)
            })
            .match('src/app/Modules/**Ctrl.js', {
                // 直接设置插件属性的值为插件处理逻辑
                postprocessor: function (content, file, settings) {
                    pack_config[file.release] = [
                        file.id+':deps',
                        file.id
                    ];

                    return content;
                }
            });
    }
}
