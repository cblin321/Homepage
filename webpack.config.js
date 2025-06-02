const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const webpack = require("webpack")

module.exports = {
    mode: "development",
    entry: "./src/index.mjs",
    output: {
        filename: "main.mjs",
        path: path.resolve(__dirname, "dist"),
        clean: true
    },
      resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
    module: {
        rules: [
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     // use: "babel-loader"
            //     use: {
            //         loader: "babel-loader",
            //         options: {
            //             presets: ["@babel/preset-env"],
            //             sourceType: "unambiguous"
            //         }
            //     }
            // },
            {
                test: /\.(jpe?g|png|gif|svg)$/i, 
                loader: "file-loader",
                options: {
                    name: "./[name].[ext]"
                }
            },

            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
        ],
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