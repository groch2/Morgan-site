"use strict";

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const fs = require("fs");
const path = require("path");
const pug = require("pug");
const express = require("express");

const sep = `${path.sep}${path.sep}`;
const removeLeadingDirectoryPart = new RegExp(
  `^${sep}?pictures${sep}(.+)$`,
  "i"
);
const getTextWithoutLeadingNumber = (text) => /(?<=^\d+\s).+$/i.exec(text)[0];
const deviceTypeAndWidth =
  require("./scripts/viewport-dimensions-by-device.json").map(
    ({ device: deviceType, width }) => ({
      deviceType,
      width,
    })
  );
const pictureBaseUrl = "../pictures-by-device-type/";
const joinAndEncode = (...pathParts) =>
  encodeURI(path.posix.join(...pathParts));
const { picturesSections, picturesBySection } = fs
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
  );

const navLinks = [
  { href: "index.html", text: "Accueil" },
  ...picturesSections.map((ps) => ({
    href: `${ps}.html`,
    text: ps,
  })),
  ...[
    { href: "#", text: "Bio" },
    { href: "contact-form.html", text: "Contact" },
  ],
];

const pathToIndex = require.resolve("./index.pug");
const pathToPicturesSection = require.resolve("./picturesSection.pug");
const trailingYearRegex = /\d{4}$/;
const htmlPagesForPicuresSections = picturesSections.map(
  (pictureSection) =>
    new HtmlWebpackPlugin({
      template: pathToPicturesSection,
      inject: true,
      chunks: ["slideshow"],
      filename: `${pictureSection}.html`,
      templateParameters: {
        pictureSection,
        pictures: picturesBySection[pictureSection].sort(
          ({ name: nameA }, { name: nameB }) => {
            let yearA = trailingYearRegex.exec(nameA);
            let yearB = trailingYearRegex.exec(nameB);
            const namesComparison = () => nameA.localeCompare(nameB);
            if (yearA === null || yearB === null) {
              return namesComparison();
            }
            yearA = parseInt(yearA[0]);
            yearB = parseInt(yearB[0]);
            const yearsComparison = yearB - yearA;
            return yearsComparison != 0 ? yearsComparison : namesComparison();
          }
        ),
        navLinks,
      },
    })
);

const pathToContactForm = require.resolve("./contact-form.pug");

module.exports = (_, { mode }) => {
  const isProductionMode = /^production$/i.test(mode);
  console.debug({ isProductionMode });
  return {
    entry: {
      index: "./index.js",
      slideshow: "./slideshow.js",
      "contact-form": "./contact-form.js",
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
                    const homePicture = picturesBySection.Peintures.filter(
                      (p) => /^nordique/i.test(p.name)
                    )[0];
                    return pug.render(content, { navLinks, homePicture });
                  } catch (error) {
                    loaderContext.emitError(error);
                  }
                },
                attributes: {
                  urlFilter: (_, value) => !/\.webp$/i.test(value),
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
          test: pathToContactForm,
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
      before: function (app) {
        app.use(
          "/pictures-by-device-type",
          express.static(path.join(__dirname, "pictures-by-device-type"))
        );
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: pathToIndex,
        filename: "index.html",
        inject: "body",
        chunks: ["index"],
      }),
      new HtmlWebpackPlugin({
        template: pathToContactForm,
        filename: "contact-form.html",
        inject: "body",
        chunks: ["contact-form", "index"],
        templateParameters: { navLinks },
      }),
      ...htmlPagesForPicuresSections,
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [{ from: "contact-form.css", to: "contact-form.css" }],
      }),
    ].filter((plugin) => plugin),
    optimization: {
      minimize: isProductionMode,
    },
    output: {
      publicPath: "",
      path: path.resolve(process.cwd(), "dist"),
    },
  };
};
