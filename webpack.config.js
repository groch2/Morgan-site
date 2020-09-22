const { CleanWebpackPlugin } = require("clean-webpack-plugin");
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
const picturesSections = ["1 Peintures", "2 Dessins", "3 Estampes", "4 Prado & Co"];
for (let picturesSection of picturesSections) {
    picturesBySection[picturesSection] = [];
    const directoryPath = path.join("pictures", picturesSection);
    const dir = fs.readdirSync(directoryPath);
    for (let picture of dir) {
        const picturePath = path.join(directoryPath, picture);
        picturesBySection[picturesSection].push(picturePath);
    }
}

const homeLinks = picturesSections.map(n => /(?<=^\d+\s).+$/.exec(n)[0]);
homeLinks.unshift("Accueil");

module.exports = ({ mode }) => {
    const pathToIndex = require.resolve("./index.pug");
    return {
        mode,
        entry: [
            pathToIndex
        ],
        module: {
            rules: [{
                test: pathToIndex,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "[name].html"
                    }
                },
                    "extract-loader",
                {
                    loader: "html-loader",
                    options: {
                        preprocessor: (content, loaderContext) => {
                            try {
                                return pug.render(content, { homeLinks, picturesBySection });
                            } catch (error) {
                                loaderContext.emitError(error);
                            }
                        },
                    }
                }
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
                }]
            },
            {
                test: /\.jpg$/,
                use: "file-loader"
            }]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new DisableOutputWebpackPlugin(/^main\.js$/i)
        ],
        output: {
            path: path.resolve(__dirname, 'dist', 'public')
        }
    }
}