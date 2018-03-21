'use strict';

const webpack = require('webpack');
const path = require('path');
const buildPath = path.join(__dirname, './dist');
var PACKAGE = require('./package.json');
var version = PACKAGE.version;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');

let entry = './sample/main.js';


let plugins = [       
    new ExtractTextPlugin('[name].[hash].css'),               
    new HtmlWebpackPlugin({   
        inject: true,     
        filename: 'index.html',        
        template: './sample/template.html',        
        title: "Sample Radar",
        version: version
    }),
    new copyWebpackPlugin([{
        from: './src/assets',
        to: 'assets'
    }]),
     new webpack.optimize.UglifyJsPlugin({
                comments: false,
                mangle: false,
                compress: {
                   warnings: false 
                }
            }) 
];

module.exports = {
    entry: entry,

    output: {
        path: buildPath,
        publicPath: '/',
        filename: '[name].[hash].js'
    },

    module: {
        loaders: [
            { test: /\.json$/, loader: 'json-loader'},          
            { test: /\.scss$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract(     {fallback:'style-loader', use: ['css-loader', 'sass-loader'] })},            
            { test: /\.(png|jpg|ico)$/, exclude: /node_modules/, loader: 'file-loader?name=images/[name].[ext]&context=./src/images' },
            { test: /\.md$/, loader:'markdown-loader'}            
        ]
    },        

    plugins: plugins,

    devtool: 'inline-source-map',

    devServer: {
        contentBase: buildPath,
        host: '0.0.0.0',
        port: 8080
    }
};