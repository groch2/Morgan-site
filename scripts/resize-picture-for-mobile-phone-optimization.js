"use strict";

const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size");
const sharp = require("sharp");

const picturesDirectory = "./pictures";
const iPhone12Height = 1284;
const iPhone12Width = 2778;
const iPhoneRatio = iPhone12Height / iPhone12Width;
const pictures = fs
  .readdirSync(picturesDirectory, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .flatMap(({ name: directory }) =>
    fs.readdirSync(path.join(picturesDirectory, directory)).map((picture) => {
      const pictureRef = path.join(directory, picture);
      const { height: pictureHeight, width: pictureWidth } = sizeOf(
        path.join(picturesDirectory, pictureRef)
      );
      const pictureRatio = pictureHeight / pictureWidth;
      const isPhoneMoreStretchedThanPicture = iPhoneRatio < pictureRatio;
      const pictureHeightOnIPhone = isPhoneMoreStretchedThanPicture
        ? iPhone12Height
        : (pictureHeight * iPhone12Width) / pictureWidth;
      const pictureWidthOnIPhone = isPhoneMoreStretchedThanPicture
        ? (pictureWidth * iPhone12Height) / pictureHeight
        : iPhone12Width;
      return {
        pictureRef,
        height: Math.round(pictureHeightOnIPhone),
        width: Math.round(pictureWidthOnIPhone),
      };
    })
  );

console.debug({ pictures });
