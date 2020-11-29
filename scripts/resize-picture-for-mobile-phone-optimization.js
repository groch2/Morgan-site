"use strict";

const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size");
const sharp = require("sharp");

const picturesDirectory = "./pictures";
const pictures = fs
  .readdirSync(picturesDirectory, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .flatMap(({ name: directory }) =>
    fs.readdirSync(path.join(picturesDirectory, directory)).map((picture) => {
      const pictureRef = path.join(directory, picture);
      const { height, width } = sizeOf(
        path.join(picturesDirectory, pictureRef)
      );
      return { pictureRef, height, width };
    })
  );

console.debug({ pictures });
