Rollup 原理
Rollup 是一个基于 ES Module 规范的 JavaScript 模块打包器核心创新在于 基于 ESM 的静态分析 和 作用域提升。，以其高效的 Tree-shaking 而闻名。

工作流程：

解析：使用 Acorn 将 ES Module 源码解析为 AST

构建模块图：从入口开始，递归分析 import 语句，构建完整的依赖关系图

Tree-shaking：通过静态分析标记未被使用的代码（死代码）

作用域提升：将所有模块"扁平化"到同一作用域，消除模块包装开销

代码生成：输出优化后的 bundle 文件

✅ 优势：Tree-shaking 效果极佳、输出代码干净高效

❌ 局限：JavaScript 编写，构建速度相对较慢


Esbuild 通过 系统级优化 实现数量级的性能提升：

Go 语言优势：编译为原生机器码，无 JS 运行时开销

高度并行化：解析、转换、代码生成等任务并行处理

内存零拷贝：精心设计的数据结构最小化内存操作

统一工具链：解析器、转换器、打包器全部自研，消除集成开销

✅ 优势：极致的构建速度，适合开发环境

❌ 局限：Tree-shaking 精细度不如 Rollup，插件生态相对年轻



3. Rolldown：融合两者的新一代引擎
核心原理
Rolldown 是 Rollup 算法 + Rust 性能 的完美结合：

架构设计：

算法继承：完全保留 Rollup 的 Tree-shaking 和作用域提升算法

性能重写：用 Rust 重写整个工具链，获得 Esbuild 级的速度

API 兼容：保持 Rollup 插件接口，确保生态平滑迁移

