const path =require("path");
const webpack = require("webpack");


module.exports ={
    mode: "development",
    module:{
        rules:[{
            test:   /\.(js|jsx)$/,
            exclude: /node_modeules/ ,
            loader: 'babel-loader'
        }
        ]
    }
};