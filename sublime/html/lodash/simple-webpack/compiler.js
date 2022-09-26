const path = require('path')
const fs = require('fs')
const { getAST, getDependencis, transform } = require('./parser')

module.exports = class Compiler {
    constructor(options) {
        const { entry, output } = options
        this.entry = entry
        this.output = output
        this.modules = [] // 收集的所有模块
        this.root = process.cwd() // 就是x-webpack-demo目录
    }
    run() {
        // 搜集依赖
        const entryModule = this.buildModule(this.entry, true)
        this.modules.push(entryModule)
        this.modules.map((_module) => {
            _module.dependencies.map((dependency) => {
                this.modules.push(this.buildModule(dependency))
            })
        })
        // 生成文件
        this.emit()
    }
    buildModule(filename, isEntry) {
        let ast;
        if (isEntry) {
            ast = getAST(filename)
        } else {
            // process.cwd() 表示根目录
            let absolutePath = path.join(this.root, './src', filename)
            ast = getAST(absolutePath)
        }
        return {
            filename,
            dependencies: getDependencis(ast),
            transformCode: transform(ast)
        }
    }
    emit() {
        const outputPath = path.join(this.output.path, this.output.filename);
        let modules = ''
        this.modules.map((_module) => {
            modules += `'${_module.filename}': function (require, module, exports) { ${_module.transformCode} },`
        });
        const bundle = `
      (function(modules) {
        function require(fileName) {
            const fn = modules[fileName];
            const module = { exports : {} };
            fn(require, module, module.exports);
            return module.exports;
        }
        require('${this.entry}');
      })({${modules}})
    `
        try {
            // 检查目录是否存在, 没有则创建
            if (!fs.existsSync(this.output.path)) {
                fs.mkdirSync(this.output.path)
            }

            // 输出
            fs.writeFileSync(outputPath, bundle, 'utf-8')
        } catch (e) {
            throw new Error(e)
        }
    }
}