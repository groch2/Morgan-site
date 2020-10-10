"use strict"

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
var fs = require("fs");
var path = require("path");
const pug = require("pug");
const sharp = require("sharp");

function DeleteOutputWebpackPlugin(...exclude) {
    this.exclude = exclude;
    this.apply = compiler => {
        compiler.hooks.emit.tapAsync("deleteOutput", (compilation, callback) => {
            Object.keys(compilation.assets).forEach(asset => {
                if (this.exclude.find(expression => expression.test(asset))) {
                    delete compilation.assets[asset];
                }
            });
            callback();
        });
    };
}

const { picturesSections, picturesBySection } =
    (function (picturesDirectories) {
        const picturesBySection = {};
        const picturesSections = [];
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
        return { picturesSections, picturesBySection };
    })(["1 Peintures", "2 Dessins", "3 Estampes"]);

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
                    pictures: picturesBySection[pictureSection].map(f => `${path.parse(f).name}.webp`)
                },
            }));

module.exports = {
    entry: {
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
                            const homeLinks = [{ href: "#", text: "Accueil" }, ...(picturesSections.map(ps => ({ href: `${ps}.html`, text: ps })))];
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
            use: "pug-loader"
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
                    quality: 80
                },
            }]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: pathToIndex,
            filename: "index.html",
            inject: false
        }),
        ...htmlPagesForPicuresSections,
        new CleanWebpackPlugin(),
        new DeleteOutputWebpackPlugin(/^main\.js$/i),
        new CopyPlugin({
            patterns:
                Object
                    .entries(picturesBySection)
                    .flatMap(s => s[1])
                    .map(picture => (
                        {
                            from: picture,
                            to: "[name].webp",
                            async transform(content) {
                                return new Promise(resolve => {
                                    resolve(sharp(content)
                                        .resize({ width: 1000 })
                                        .webp()
                                        .toBuffer());
                                });
                            },
                        })),
            options: {
                concurrency: 100,
            }
        })
    ],
    output: {
        path: path.resolve(__dirname, "dist")
    }
}
