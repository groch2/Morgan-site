"use strict";

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const path = require("path");
const pug = require("pug");

function DeleteOutputWebpackPlugin(...exclude) {
  this.exclude = exclude;
  this.apply = (compiler) => {
    compiler.hooks.emit.tapAsync("deleteOutput", (compilation, callback) => {
      Object.keys(compilation.assets).forEach((asset) => {
        if (this.exclude.find((expression) => expression.test(asset))) {
          delete compilation.assets[asset];
        }
      });
      callback();
    });
  };
}

const sep = `${path.sep}${path.sep}`;
const removeLeadingDirectoryPart = new RegExp(
  `^${sep}?pictures${sep}(.+)$`,
  "i"
);
const getTextWithoutLeadingNumber = (text) => /(?<=^\d+\s).+$/i.exec(text)[0];
const deviceTypeAndWidth = require("./scripts/viewport-dimensions-by-device.json").map(
  ({ device: deviceType, width }) => ({
    deviceType,
    width,
  })
);
const pictureBaseUrl = "../pictures-by-device-type/";
const joinAndEncode = (...pathParts) =>
  encodeURI(path.posix.join(...pathParts));
const { picturesSections, picturesBySection } = (() =>
  fs
    .readdirSync("./pictures", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => ({
      sectionName: getTextWithoutLeadingNumber(dirent.name),
      directory: path.join("pictures", dirent.name),
    }))
    .reduce(
      ({ picturesSections, picturesBySection }, { sectionName, directory }) => {
        picturesSections.push(sectionName);
        picturesBySection[sectionName] = fs
          .readdirSync(directory)
          .map((pictureFile) => {
            const name = path.parse(pictureFile).name;
            const picureTrailingUrl = path.posix.join(
              getTextWithoutLeadingNumber(
                removeLeadingDirectoryPart.exec(directory)[1]
              ),
              `${name}.webp`
            );
            return {
              name,
              url: joinAndEncode(pictureBaseUrl, "mobile", picureTrailingUrl),
              srcset: deviceTypeAndWidth
                .map(({ deviceType, width }) => {
                  return `${joinAndEncode(
                    pictureBaseUrl,
                    deviceType,
                    picureTrailingUrl
                  )} ${width}w`;
                })
                .join(", "),
            };
          });
        return { picturesSections, picturesBySection };
      },
      { picturesSections: [], picturesBySection: {} }
    ))();

const pathToIndex = require.resolve("./index.pug");
const pathToPicturesSection = require.resolve("./picturesSection.pug");
const htmlPagesForPicuresSections = picturesSections.map(
  (pictureSection) =>
    new HtmlWebpackPlugin({
      template: pathToPicturesSection,
      inject: true,
      chunks: ["slideshow"],
      filename: `${pictureSection}.html`,
      templateParameters: {
        pictures: picturesBySection[pictureSection],
      },
    })
);

module.exports = (_, { mode }) => {
  const isProductionMode = /^production$/i.test(mode);
  console.debug({ isProductionMode });
  return {
    entry: {
      slideshow: "./slideshow.js",
      index: "./index.js",
    },
    module: {
      rules: [
        {
          test: pathToIndex,
          use: [
            {
              loader: "html-loader",
              options: {
                preprocessor: (content, loaderContext) => {
                  try {
                    const homeLinks = [
                      ...picturesSections.map((ps) => ({
                        href: `${ps}.html`,
                        text: ps,
                      })),
                      ...["Bio", "Contact"].map((s) => ({
                        href: "#",
                        text: s,
                      })),
                    ];
                    return pug.render(content, { homeLinks });
                  } catch (error) {
                    loaderContext.emitError(error);
                  }
                },
              },
            },
          ],
        },
        {
          test: pathToPicturesSection,
          use: "pug-loader",
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[hash].css",
              },
            },
            "extract-loader",
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                sassOptions: {
                  includePaths: [
                    "./node_modules/w3-css/",
                    "./node_modules/swiper/",
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.jpg$/,
          use: [
            {
              loader: "webpack-image-resize-loader",
              options: {
                width: 1000,
                format: "webp",
                quality: 80,
              },
            },
          ],
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "fonts/",
              },
            },
          ],
        },
      ],
    },
    devServer: {
      contentBase: "./dist",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: pathToIndex,
        filename: "index.html",
        inject: "body",
        chunks: ["index"],
      }),
      ...htmlPagesForPicuresSections,
      new CleanWebpackPlugin(),
      new DeleteOutputWebpackPlugin(/^main\.js$/i),
    ].filter((plugin) => plugin),
  };
};
