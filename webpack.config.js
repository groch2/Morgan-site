"use strict";

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const path = require("path");
const pug = require("pug");

module.exports = (_, { mode }) => {
  const isProductionMode = /^production$/i.test(mode);
  console.debug({ isProductionMode });

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
  const joinAndEncode = (...pathParts) =>
    encodeURI(path.posix.join(...pathParts));
  const pictureBaseUrl =
    !isProductionMode ?
      "../pictures-by-device-type/" :
      "https://morgan-site-pictures-by-device-type.s3.eu-west-3.amazonaws.com/";
  const trailingYearRegex = /\d{4}$/;
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
        picturesBySection[sectionName].sort(
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
        );
        return { picturesSections, picturesBySection };
      },
      { picturesSections: [], picturesBySection: {} }
    );

  const picturesSectionsList =
    Object.entries(picturesBySection)
      .map(([sectionName, pictures]) => ({ name: sectionName, pictures: pictures.map(picture => picture.name) }));

  const navLinks = [
    { href: "/", text: "Accueil" },
    ...picturesSections.map((ps) => ({
      href: ps,
      text: ps,
    })),
    ...[
      { href: "CV", text: "Bio" },
      { href: "contact-form", text: "Contact" },
    ],
  ];

  const pathToPicturesSection = require.resolve("./pictures-section.pug");
  const htmlPagesForPicuresSections = picturesSections.map(
    (pictureSection) =>
      new HtmlWebpackPlugin({
        template: pathToPicturesSection,
        inject: true,
        chunks: ["slideshow"],
        filename: `${pictureSection}.html`,
        templateParameters: {
          pictureSection,
          pictures: picturesBySection[pictureSection],
          navLinks,
        },
      })
  );

  const pathToIndex = require.resolve("./index.pug");
  const pathToContactForm = require.resolve("./contact-form.pug");
  const pathToCV = require.resolve("./CV.pug");
  const pathToPicturesSectionsList = require.resolve("./pictures-sections-list.pug");
  return {
    entry: {
      index: "./index.js",
      slideshow: "./slideshow.js",
      "contact-form": "./contact-form.js",
      cv: "./cv.js",
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
          test: [pathToPicturesSection, pathToContactForm, pathToCV, pathToPicturesSectionsList],
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
      static: [
        {
          directory: path.join(__dirname, "pictures-by-device-type"),
          publicPath: "/pictures-by-device-type/",
        },
      ],
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
        chunks: ["contact-form"],
        templateParameters: { navLinks },
      }),
      ...htmlPagesForPicuresSections,
      new HtmlWebpackPlugin({
        template: pathToCV,
        filename: "CV.html",
        inject: "body",
        chunks: ["cv"],
        templateParameters: { navLinks },
      }),
      new HtmlWebpackPlugin({
        template: pathToPicturesSectionsList,
        filename: "pictures-sections-list.html",
        chunks: [],
        templateParameters: { sections: picturesSectionsList }
      }),
      new CleanWebpackPlugin(),
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
