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
const picturesSections = [];
const picturesDirectories = ["1 Peintures", "2 Dessins", "3 Estampes", "4 Prado & Co"];
for (let picturesDirectory of picturesDirectories) {
    const pictureSection = /(?<=^\d+\s).+$/.exec(picturesDirectory)[0];
    picturesSections.push(pictureSection);
    picturesBySection[pictureSection] = [];
    const picturesDirectoryPath = path.join("pictures", picturesDirectory);
    const dir = fs.readdirSync(picturesDirectoryPath);
    for (let picture of dir) {
        const picturePath = path.join(picturesDirectoryPath, picture);
        picturesBySection[pictureSection].push(picturePath);
    }
}

module.exports = ({ mode }) => {
    const pathToIndex = require.resolve("./index.pug");
    const pathToPicturesSection = require.resolve("./picturesSection.pug");
    const htmlPagesForPicuresSections =
        picturesSections
            .map(pictureSection =>
                new HtmlWebpackPlugin({
                    template: pathToPicturesSection,
                    inject: true,
                    chunks: ["slideshow"],
                    filename: `${pictureSection}.html`,
                    templateParameters: {
                        pictures: picturesBySection[pictureSection]
                    },
                }));
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
                                const homeLinks = ["Accueil", ...picturesSections];
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
                use: ["pug-loader"]
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
                use: [{
                    loader: "webpack-image-resize-loader",
                    options: {
                        width: 1000,
                        format: "webp",
                        quality: 80,
                    },
                }]
            }]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: pathToIndex,
                filename: "index.html"
            }),
            ...htmlPagesForPicuresSections,
            new CleanWebpackPlugin(),
            new DisableOutputWebpackPlugin(/^main\.js$/i)
        ],
        output: {
            path: path.resolve(__dirname, 'dist', 'public')
        }
    }
}