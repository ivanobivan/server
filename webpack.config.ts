const path = require('path');
const webpack = require('webpack');


module.exports = {
    devtool: "cheap-source-map",
    entry: path.join(__dirname, '/src/main/ts/form/index.tsx'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '/dist'),
        publicPath: "/dist"
    },
    devServer: {
        hot: true,
        inline: true,
        /*proxy: {
            '/api': {
                target: 'http://0.0.0.0:3000', // 192.168.0.123
                secure: false
            }
        },*/
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
            ignored: /node_modules/
        },
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },

            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
        /*rules: [
            {
                test: /\.(tsx?)|(js)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'less-loader'
                }]
            }
        ],*/
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // new HardSourceWebpackPlugin()
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    enforce: true
                },
            }
        }
    }
};
