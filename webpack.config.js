const { CleanWebpackPlugin } = require("clean-webpack-plugin");

function DisableOutputWebpackPlugin(...exclude) {
    this.exclude = exclude;
    this.apply = compiler => {
        compiler.hooks.emit.tapAsync('x', (compilation, callback) => {
            Object.keys(compilation.assets).forEach(asset => {
                if (this.exclude.find(expression => expression.test(asset))) {
                    delete compilation.assets[asset];
                }
            });
            callback();
        });
    };
}

module.exports = ({ mode }) => {
    const pathToIndexHtml = require.resolve("./index.html");
    return {
        mode,
        entry: [
            pathToIndexHtml
        ],
        module: {
            rules: [{
                    test: pathToIndexHtml,
                    use: [{
                            loader: "file-loader",
                            options: {
                                name: "[name].[ext]"
                            }
                        },
                        "extract-loader",
                        "html-loader",
                    ]
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [{
                            loader: "file-loader",
                            options: {
                                name: "[hash].css"
                            }
                        },
                        "extract-loader",
                        "css-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                sassOptions: {
                                    includePaths: "./node_modules/w3-css/"
                                }
                            }
                        },
                    ]
                },
                {
                    test: /\.jpg$/,
                    use: "file-loader"
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new DisableOutputWebpackPlugin(/^main\.js$/i)
        ]
    }
}