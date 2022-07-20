//引入一个包
const path = require("path");
//引入html生成插件
const HTMLWebpackPlugin = require("html-webpack-plugin");
//引入clean插件，确保dist中的文件中实时保持为最新的状态
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
console.log('webpack')

//webpack的配置信息都在此文件中
module.exports = {
    //指定入口文件，从何处开始进行打包
    entry: "./src/debounce.ts",
    //指定为开发模式
    mode: "development",
    //指定打包文件所在的目录
    output: {
        //指定打包的文件的目录
        path: path.resolve(__dirname, "dist"),
        //打包后文件的文件名
        filename: "bundle.js",
        //告诉webpack不使用箭头函数
        environment: {
            arrowFunction: false,
        },
    },
    //指定webpack打包使用的模块
    module: {
        //指定加载的规则，
        rules: [
            {
                //test是指定规则生效的文件,匹配以ts结尾的文件。
                test: /\.ts$/,
                //要使用的loader
                use: [
                    {
                        //指定加载器
                        loader: "babel-loader",
                        //设置babel
                        options: {
                            //设置预定义的环境
                            presets: [
                                //指定环境的插件
                                "@babel/preset-env",
                                //配置信息
                                {
                                    //需要兼容的目标浏览器,
                                    target: {
                                        chrome: "68",
                                        IE: "11",

                                    },
                                    //指定corejs的版本
                                    corejs: "3",
                                    //使用corejs的方式，表示按需加载
                                    useBuiltIns: "usage",
                                },
                            ],
                        },
                    },
                    "ts-loader",
                ],
                //要排除的文件
                exclude: /node-module/,
            },
        ],
    },
    //配置webpack使用的插件
    plugins: [
        //使用所引入的模块
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin(),
        //配置生成的html模板
    ],
    //用于设置引用的模块，使得编译器知道以.ts和.js结尾的文件可以作为模块化使用。
    resolve: {
        extensions: [".ts", ".js"],
    },
};