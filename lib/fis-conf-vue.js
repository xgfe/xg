var fs = require('fs');
var path = require('path');
var extend = require('extend');

var pages = {};
var components = {};

var DEFAULT_NODE = {
    path: null,
    components: null,
    js: null,
    css: null
};


fis.match('**.scss', {
    rExt: '.css', // from .scss to .css
    parser: fis.plugin('sass', {
        //fis-parser-sass option
    })
});

// 判断依赖是否存在
fis.match('**.{js,scss}', {
    preprocessor: function(content, file, settings) {
        var _type = file.rExt.substr(1);
        if (file.subpath.match(/^\/page\//)) {
            if (!pages[file.subpathNoExt]) {
                pages[file.subpathNoExt] = extend({}, DEFAULT_NODE);
            }

            pages[file.subpathNoExt][_type] = file.url;
        } else if (file.subpath.match(/^\/component\//)) {
            var lastSplitIndex = file.subdirname.lastIndexOf('/');
            var componentName = file.subdirname.substr(lastSplitIndex+1);

            if (!components[componentName]) {
                components[componentName] = extend({}, DEFAULT_NODE);
            }

            components[componentName][_type] = file.url;
        }

        // console.log(pages);
        // console.log(components);
        return content;
    }
});

// 页面入口文件分析
fis.match('/page/**.html', {
    preprocessor: function(content, file, settings) {
        if (!pages[file.subpathNoExt]) {
            pages[file.subpathNoExt] = extend({}, DEFAULT_NODE);
        }

        pages[file.subpathNoExt].path = file.subpath;
        pages[file.subpathNoExt].components = componentsAnalyse(content);

        //console.log(pages);
        return content;
    }

});

// 组件分析
fis.match('/component/**.html', {
    preprocessor: function(content, file, settings) {
        var lastSplitIndex = file.subdirname.lastIndexOf('/');
        var componentName = file.subdirname.substr(lastSplitIndex+1);

        if (!components[componentName]) {
            components[componentName] = extend({}, DEFAULT_NODE);
        }

        components[componentName].path = file.subpath;
        components[componentName].components = componentsAnalyse(content);

         //console.log(components);
        return content;
    }
});

/**
 * 组件依赖分析
 * @param  {string} contentStr html结构
 * @return {array}             依赖的组件名称array | null
 * 
 */
var REGEXPSTR_HTML_COMPONENT = '<(com-[\\w-]+)>.*<\\/\\1>';
function componentsAnalyse(contentStr) {
    var comSearchResults = contentStr.match(new RegExp(REGEXPSTR_HTML_COMPONENT, 'gm'));
    var components = [];

    // 无依赖
    if (!comSearchResults) {
        return null;
    }

    var comNameCatchRegExp = new RegExp(REGEXPSTR_HTML_COMPONENT);
    for (var i = 0, l = comSearchResults.length; i < l; i++) {
        components.push(comSearchResults[i].match(comNameCatchRegExp)[1]);
    }

    return components;
}

/**
 * 页面依赖分析
 * @param  {object | array} pageObj 页面入口文件或者组件依赖文件文件
 * @return {[type]}         [description]
 */
function dependenceAnalyse(pageObj) {
    var dependences = {
        jsDependeces: [],
        cssDependeces: []
    };

    if (pageObj instanceof Array) {
        // 组件依赖数组
        pageObj.forEach(function(page) {
            var comDependences = dependenceAnalyse(components[page]);
            dependences.jsDependeces = dependences.jsDependeces.concat(comDependences.jsDependeces);
            dependences.cssDependeces = dependences.cssDependeces.concat(comDependences.cssDependeces);
        });
    } else {

        if (pageObj.components) {
            var comDependences = dependenceAnalyse(pageObj.components);
            dependences.jsDependeces = dependences.jsDependeces.concat(comDependences.jsDependeces);
            dependences.cssDependeces = dependences.cssDependeces.concat(comDependences.cssDependeces);
        }

        // 页面自身依赖需要后置---通常，需要考虑加载关系
        if (pageObj.js) {
            dependences.jsDependeces.push(pageObj.js);
        }
        if (pageObj.css) {
            dependences.cssDependeces.push(pageObj.css);
        }
    }
    
    return dependences;
}

// 打包阶段插件
var root = fis.project.getProjectPath();

fis.match('::package', {
    prepackager: function (ret, conf, settings, opt) {
        // ret.src 所有的源码，结构是 {'<subpath>': <File 对象>}
        // ret.ids 所有源码列表，结构是 {'<id>': <File 对象>}
        // ret.map 如果是 spriter、postpackager 这时候已经能得到打包结果了，
        //         可以修改静态资源列表或者其他
        
        console.log('----------prepackager----------');
        // var testFile = fis.file(root, '/page/index/index.html');
        for (var key in pages) {
            // var pageFile = ret.src[pages[key].path];
            extend(pages[key], dependenceAnalyse(pages[key]));
        }
        console.log(pages);

        // console.log(ret.src['/page/index/index.html']._content);
        // console.log(pages);
        // console.log(components);
    },
    packager: function (ret, conf, settings, opt) {
        // ret.src 所有的源码，结构是 {'<subpath>': <File 对象>}
        // ret.ids 所有源码列表，结构是 {'<id>': <File 对象>}
        // ret.map 如果是 spriter、postpackager 这时候已经能得到打包结果了，
        //         可以修改静态资源列表或者其他
        
        console.log('----------packager----------');
    },
    spriter: function (ret, conf, settings, opt) {
        // ret.src 所有的源码，结构是 {'<subpath>': <File 对象>}
        // ret.ids 所有源码列表，结构是 {'<id>': <File 对象>}
        // ret.map 如果是 spriter、postpackager 这时候已经能得到打包结果了，
        //         可以修改静态资源列表或者其他
        
        console.log('----------spriter----------');
    },
    postpackager: function (ret, conf, settings, opt) {
        // ret.src 所有的源码，结构是 {'<subpath>': <File 对象>}
        // ret.ids 所有源码列表，结构是 {'<id>': <File 对象>}
        // ret.map 如果是 spriter、postpackager 这时候已经能得到打包结果了，
        //         可以修改静态资源列表或者其他
        
        for (var key in pages) {
            var pageFile = ret.src[pages[key].path];
            var headerStr = '';
            var footerStr = '';

            pages[key].jsDependeces.forEach(function(jsPath) {
                headerStr += '<script src="' + jsPath + '"></script>\n';
            });

            pages[key].cssDependeces.forEach(function(cssPath) {
                footerStr += '<link rel="stylesheet" href="' + cssPath + '">\n';
            });

            pageFile._content = pageFile._content.replace(/\$\{PAGE_HEADER_CONFIG\}/, footerStr)
                .replace(/\$\{PAGE_FOOTER_CONFIG\}/, headerStr);
        }
        console.log('----------postpackager----------');
    }
});