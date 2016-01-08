exports.config = function() {

    fis.set('project.ignore', [
        'doc/**',
        '.bowerrc',
        'fis-conf.js'
    ])
        /* 对css文件需要依赖打包 */
        .match('::package', {
            prepackager: function (ret, conf, settings, opt) {
                // ret.src 所有的源码，结构是 {'<subpath>': <File 对象>}
                // ret.ids 所有源码列表，结构是 {'<id>': <File 对象>}
                // ret.map 如果是 spriter、postpackager 这时候已经能得到打包结果了，
                //         可以修改静态资源列表或者其他
                var timestamp = new Date().getTime().toString().substr(0, 10);
                var srcs = ret.src || {};
                fis.util.map(srcs, function(src, file) {
                    if (src.match(/^\/index.html/)) {
                        file.setContent(
                            file.getContent().replace(/\$\{__maintimestamp__\}/g, '?' + timestamp)
                        );
                    }
                    if (!src.match(/^\/lib/) && src.match(/\.(html|js)$/)) {
                        file.setContent(
                            file.getContent().replace(/\$\{__timestamp__\}/g, timestamp)
                        );
                    }
                });
            },
            packager: fis.plugin('deps-pack', {
                '/assets/css/style.css': [
                    'common/css/style.css:deps',
                    'common/css/style.css'
                ]
            })
        })
        .match('/{app,common}/(**)', {
            release: '/assets/$1$2'
        });


    // 文件打包通用部分配置
    var pack_config = {
        '/assets/main.js': [
            'app/app.js',
            'app/appCtrl.js',
            'app/appInit.js',
            'app/main.js'
        ],
        '/assets/Directive/directives.js': [
            'app/Directive/directives.js:deps',
            'app/Directive/directives.js'
        ],
        '/assets/Factory/factories.js': [
            'app/Factory/factories.js:deps',
            'app/Factory/factories.js'
        ],
        '/assets/Filter/filters.js': [
            'app/Filter/filters.js:deps',
            'app/Filter/filters.js'
        ],
        '/assets/Service/services.js': [
            'app/Service/services.js:deps',
            'app/Service/services.js'
        ],
        '/assets/Router/routers.js': [
            'app/Router/routers.js:deps',
            'app/Router/routers.js'
        ],
        '/assets/css/style.css': [
            'common/css/style.css:deps',
            'common/css/style.css'
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
        .match('*', {
            deploy: fis.plugin('local-deliver', {
                to: '../dist'
            })
        });

    /**
     * 正式发布的文件处理配置
     */

    function setPublish(mediaFis) {
        return mediaFis.hook('amd')
            .match('/app/(**).js', {
                isMod: true,
                moduleId: '$1'
            })
            .match('/app/main.js', {
                isMod: false
            })
            .match('/lib/**', {
                skipDepsAnalysis: true
            })
            .match('/app/Modules/(**).js', {
                isMod: true,
                moduleId: '$1'
            })
            .match('::package', {
                packager: fis.plugin('deps-pack', pack_config)
            })
            .match('/app/Modules/**Ctrl.js', {
                // 直接设置插件属性的值为插件处理逻辑
                postprocessor: function (content, file, settings) {
                    pack_config[file.release] = [
                        file.id+':deps',
                        file.id
                    ];

                    return content;
                }
            })
            // 文件压缩
            .match('/app/**.js', {
                // fis-optimizer-uglify-js 插件进行压缩，已内置
                optimizer: fis.plugin('uglify-js')
            })
            .match('/{app,common}/**.css', {
                // fis-optimizer-clean-css 插件进行压缩，已内置
                optimizer: fis.plugin('clean-css')
            })
            .match('/{app,common}/**.png', {
                // fis-optimizer-png-compressor 插件进行压缩，已内置
                optimizer: fis.plugin('png-compressor')
            })
            .match('transpond-config.js', {
                release: false
            });
    }
}
