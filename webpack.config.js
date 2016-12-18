const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/init.ts',
    output: {
        path: './dist',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'ts-loader'
        }]
    },
    plugins: [new HtmlWebpackPlugin()]
}