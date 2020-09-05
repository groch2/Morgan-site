const { CleanWebpackPlugin } = require("clean-webpack-plugin");
var fs = require('fs');
var path = require('path');

function DisableOutputWebpackPlugin(...exclude) {
    this.exclude = exclude;
    this.apply = compiler => {
        compiler.hooks.emit.tapAsync("x", (compilation, callback) => {
            Object.keys(compilation.assets).forEach(asset => {
                if (this.exclude.find(expression => expression.test(asset))) {
                    delete compilation.assets[asset];
                }
            });
            callback();
        });
    };
}

const slideByDirectory = {};
const directories = ["1 Peintures", "2 Dessins", "3 Estampes", "4 Prado & Co"];
for (let directory of directories) {
    slideByDirectory[directory] = [];
    const dir = fs.readdirSync(directory);
    for (let picture of dir) {
        const picturePath = path.join(directory, picture);
        slideByDirectory[directory].push(picturePath);
    }
}

const homeLinks = directories.map(n => /(?<=^\d+\s).+$/.exec(n)[0]);
homeLinks.unshift("Home");

module.exports = ({ mode }) => {
    const pathToIndexHtml = require.resolve("./index.html");
    return {
        mode,
        entry: [
            pathToIndexHtml,
            "./file.ejs"
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
                {
                    test: /\.ejs$/,
                    use: [{
                            loader: "file-loader",
                            options: {
                                name: "[name].html",
                                context: "./src/",
                                outputPath: "/"
                            }
                        },
                        {
                            loader: "extract-loader"
                        },
                        {
                            loader: "ejs-webpack-loader",
                            options: {
                                data: { slideByDirectory },
                                htmlmin: false
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new DisableOutputWebpackPlugin(/^main\.js$/i)
        ]
    }
}