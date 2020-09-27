const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
var fs = require('fs');
var path = require('path');
const pug = require('pug');

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

const picturesBySection = {};
const picturesDirectories = ["1 Peintures", "2 Dessins", "3 Estampes", "4 Prado & Co"];
for (let picturesDirectory of picturesDirectories) {
    picturesBySection[picturesDirectory] = [];
    const picturesDirectoryPath = path.join("pictures", picturesDirectory);
    const dir = fs.readdirSync(picturesDirectoryPath);
    for (let picture of dir) {
        const picturePath = path.join(picturesDirectoryPath, picture);
        picturesBySection[picturesDirectory].push(picturePath);
    }
}

const picturesSections = picturesDirectories.map(n => /(?<=^\d+\s).+$/.exec(n)[0]);

const homeLinks = ["Accueil", ...picturesSections];

module.exports = ({ mode }) => {
    const pathToIndex = require.resolve("./index.pug");
    const pathToPicturesSection = require.resolve("./picturesSection.pug");
    return {
        mode,
        entry: {
            main: pathToIndex,
            slideshow: "./slideshow.js"
        },
        module: {
            rules: [{
                test: pathToIndex,
                use: [{
                    loader: "html-loader",
                    options: {
                        preprocessor: (content, loaderContext) => {
                            try {
                                return pug.render(content, { homeLinks });
                            } catch (error) {
                                loaderContext.emitError(error);
                            }
                        }
                    },
                }]
            },
            {
                test: pathToPicturesSection,
                use: [{
                    loader: "html-loader",
                    options: {
                        preprocessor: (content, loaderContext) => {
                            // console.debug({ test: loaderContext.resourcePath });
                            try {
                                return pug.render(content, { picturesBySection });
                            } catch (error) {
                                loaderContext.emitError(error);
                            }
                        }
                    },
                }]
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
                }]
            },
            {
                test: /\.jpg$/,
                use: "file-loader"
            }]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: pathToIndex,
                filename: "index.html"
            }),
            new HtmlWebpackPlugin({
                template: pathToPicturesSection,
                inject: true,
                chunks: ["slideshow"],
                filename: "dessins.html"
            }),
            new CleanWebpackPlugin(),
            new DisableOutputWebpackPlugin(/^main\.js$/i)
        ],
        output: {
            path: path.resolve(__dirname, 'dist', 'public')
        }
    }
}