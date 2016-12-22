const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require("webpack");

module.exports = {
    entry: './src/init.ts',
    output: {
        path: './dist',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.css']
    },
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'ts-loader'
        },{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader","css-loader")
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Datavis',
            template: 'src/index.ejs'
        }),
        // http://stackoverflow.com/questions/28969861/managing-jquery-plugin-dependency-in-webpack#answer-28989476
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
}