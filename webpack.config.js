const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const webpack = require("webpack")

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        clean: true
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html"
        })
    ],

        devServer: {
            watchFiles: ["./src/index.html"]
        }



}