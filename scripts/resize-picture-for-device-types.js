"use strict";

const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size");
const sharp = require("sharp");

const picturesDirectory = "./pictures";
const deviceType = "mobile";
const factor = 1.5;
const deviceViewportHeight = 428 * factor;
const deviceViewportWidth = 926 * factor;
const deviceViewportRatio = deviceViewportHeight / deviceViewportWidth;
const pictureDirectories = fs
  .readdirSync(picturesDirectory, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory());
const deviceTypePicturesDirectory = `./pictures-by-device-type/${deviceType}`;
fs.rmdirSync(deviceTypePicturesDirectory, { recursive: true });
fs.mkdirSync(deviceTypePicturesDirectory);
pictureDirectories.forEach(({ name: directory }) =>
  fs.mkdirSync(path.join(deviceTypePicturesDirectory, directory))
);
fs.writeFileSync(
  path.join(deviceTypePicturesDirectory, "target-viewport-size.txt"),
  `${Math.round(deviceViewportWidth)} x ${Math.round(deviceViewportHeight)}`
);
pictureDirectories
  .flatMap(({ name: directory }) =>
    fs.readdirSync(path.join(picturesDirectory, directory)).map((picture) => {
      const ref = path.join(directory, picture);
      const { height: pictureHeight, width: pictureWidth } = sizeOf(
        path.join(picturesDirectory, ref)
      );
      const pictureRatio = pictureHeight / pictureWidth;
      const isViewportMoreStretchedThanPicture =
        deviceViewportRatio < pictureRatio;
      const pictureHeightForDevice = isViewportMoreStretchedThanPicture
        ? deviceViewportHeight
        : (pictureHeight * deviceViewportWidth) / pictureWidth;
      const pictureWidthForDevice = isViewportMoreStretchedThanPicture
        ? (pictureWidth * deviceViewportHeight) / pictureHeight
        : deviceViewportWidth;
      return {
        ref,
        height: Math.round(pictureHeightForDevice),
        width: Math.round(pictureWidthForDevice),
      };
    })
  )
  .forEach(({ ref, height, width }) => {
    const fileExt = path.extname(ref);
    const newFile = ref.replace(new RegExp(`${fileExt}$`), ".webp");
    sharp(path.join(picturesDirectory, ref))
      .resize(width, height)
      .webp()
      .toFile(path.join(deviceTypePicturesDirectory, newFile), (err) => {
        if (err) {
          console.log(err);
        }
      });
  });
