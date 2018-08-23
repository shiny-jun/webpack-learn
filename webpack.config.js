const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
// const extractTextPlugin = require('extract-text-webpack-plugin') // webpack4不能用了
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require('glob'); // 消除未使用的CSS
const PurifyCSSPlugin = require("purifycss-webpack");
const webpack = require("webpack");

// 利用node的语法来读取type的值，然后根据type的值用if–else判断
if (process.env.type == "build") {
    var website = {
        publicPath: "http://127.0.0.1:1717/"
    }
} else {
    var website = {
        publicPath: "http://127.0.0.1:1717/"
    }
}
console.log(encodeURIComponent(process.env.type));

module.exports = {
    devtool: 'eval-source-map',
    // context: path.resolve(__dirname,'./src'),
    // 配置入口文件的地址，可以是单一入口，也可以是多入口。
    entry: {
        entry: './src/entry.js',
        entry2: './src/entry2.js'
    },
    // 配置出口文件的地址，在webpack2.X版本后，支持多出口配置。
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        publicPath: website.publicPath
    },
    // 配置模块，主要是解析CSS和图片转换压缩等功能。
    module: {
        rules: [{
                // test：用于匹配处理文件的扩展名的表达式，这个选项是必须进行配置的
                test: /\.css$/,
                // use：loader名称，就是你要使用模块的名称，这个选项也必须进行配置，否则报错
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: '../',
                        }
                    },
                    "css-loader", {
                        // css 前序配置
                        loader: "postcss-loader"
                    }
                ]
            },
            {
                // test:/\.(png|jpg|gif)/是匹配图片文件后缀名称
                test: /\.(png|jpg|gif)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // limit：是把小于5000B的文件打成Base64的格式，写入JS
                        limit: 5000,
                        outputPath: 'images/',
                    }
                }]
            }, {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
                // }, {
                // 发现图片并没有放到images文件夹下,还有一种方法就是直接配置file-loader
                //     test:/\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                //     use:[{
                //         loader:'file-loader',
                //         options:{
                //             name: 'images/[name].[ext]?[hash]'
                //         }
                //     }]
            }, {
                // less 文件分离（写在css了）
                test: /\.less$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: '../',
                        }
                    }, "css-loader" // translates CSS into CommonJS
                    , "less-loader" // compiles Less to CSS
                ]
            }, {
                // sass
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            }, {
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader',

                },
                exclude: /node_modules/
            }
        ]
    },
    // 配置插件，根据你的需要配置不同功能的插件。
    plugins: [
        new uglify(),
        new htmlPlugin({
            // minify：是对html文件进行压缩，removeAttrubuteQuotes是却掉属性的双引号。
            minify: {
                removeAttributeQuotes: true
            },
            // hash：为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS
            hash: true,
            // template：是要打包的html模版路径和文件名称
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        new webpack.ProvidePlugin({
            $: "jquery" // 全局使用jquery
        })
    ],
    // 配置开发服务功能，后期我们会详细讲解
    devServer: {
        //设置基本目录结构
        contentBase: path.resolve(__dirname, 'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host: 'localhost',
        //服务端压缩是否开启
        compress: true,
        //配置服务端口号
        port: 1717
    },
    watchOptions: {
        poll: 1000, //监测修改的时间(ms)
        aggregeateTimeout: 500, //防止重复按键，500毫米内算按键一次
        ignored: /node_modules/, //不监测
    }
}