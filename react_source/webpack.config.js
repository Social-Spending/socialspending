const path = require('path');
const { ProvidePlugin } = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

class HTMLFix {
    apply(compiler) {
        compiler.hooks.emit.tap("Route", (compilation) => {
            let source = compilation.getAsset('index.html').source.source();

            source = source.replaceAll("src=\"./bundles/", "src=\"/bundles/");

            compilation.getAsset('index.html').source._value = source;
            compilation.getAsset('index.html').source._valueAsString = source;
        })
    }
}

module.exports = {
    mode: 'production',
    entry: './main.js',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Social Spending',
        }),
        new ProvidePlugin({
            React: 'react',
            // ...
        }),
        new HTMLFix()

    ],
    output: {
        filename: './bundles/[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: './assets/[hash][ext]',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: path.resolve('./route-loader.js'),
                        options: {
                            /* ... */
                        },
                    },
                ],
            },
            {
                test: /\.?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.(png|jp(e*)g|svg|gif)$/,
                type: 'asset/resource',
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            }

        ]
    },
    optimization: {

        usedExports: true
    },
};