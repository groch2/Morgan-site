"use strict";

const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size");
const sharp = require("sharp");

const picturesDirectory = "./pictures";
const factor = 1.5;
require("./viewport-dimensions-by-device.json").forEach(
  ({ device, width, height }) => {
    const [originalWidth, originalHeight] = [width, height];
    [width, height] = [width, height].map((n) => parseInt(n) * factor);
    const deviceViewportRatio = height / width;
    const pictureDirectories = fs
      .readdirSync(picturesDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map(({ name: directory }) => directory);
    const deviceTypePicturesDirectory = `./pictures-by-device-type/${device}`;
    fs.rmdirSync(deviceTypePicturesDirectory, { recursive: true });
    fs.mkdirSync(deviceTypePicturesDirectory);
    fs.writeFileSync(
      path.join(deviceTypePicturesDirectory, "target-viewport-size.json"),
      JSON.stringify({ width: originalWidth, height: originalHeight }, null, 2)
    );
    const getTextWithoutLeadingNumber = (text) =>
      /(?<=^\d+\s).+$/i.exec(text)[0];
    pictureDirectories.forEach((directory) =>
      fs.mkdirSync(
        path.join(
          deviceTypePicturesDirectory,
          getTextWithoutLeadingNumber(directory)
        )
      )
    );
    pictureDirectories
      .flatMap((directory) =>
        fs
          .readdirSync(path.join(picturesDirectory, directory))
          .map((picture) => {
            const sourceRef = path.join(directory, picture);
            const { height: pictureHeight, width: pictureWidth } = sizeOf(
              path.join(picturesDirectory, sourceRef)
            );
            const pictureRatio = pictureHeight / pictureWidth;
            const isViewportMoreStretchedThanPicture =
              deviceViewportRatio < pictureRatio;
            const pictureHeightForDevice = isViewportMoreStretchedThanPicture
              ? height
              : (pictureHeight * width) / pictureWidth;
            const pictureWidthForDevice = isViewportMoreStretchedThanPicture
              ? (pictureWidth * height) / pictureHeight
              : width;
            return {
              sourceRef,
              targetRef: path.join(
                getTextWithoutLeadingNumber(directory),
                picture
              ),
              height: Math.round(pictureHeightForDevice),
              width: Math.round(pictureWidthForDevice),
            };
          })
      )
      .forEach(({ sourceRef, targetRef, height, width }) => {
        const fileExt = path.extname(targetRef);
        const newFile = targetRef.replace(new RegExp(`${fileExt}$`), ".webp");
        sharp(path.join(picturesDirectory, sourceRef))
          .resize(width, height)
          .webp()
          .toFile(path.join(deviceTypePicturesDirectory, newFile), (err) => {
            if (err) {
              console.log(err);
            }
          });
      });
  }
);
