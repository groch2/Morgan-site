"use strict";

const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size");
const sharp = require("sharp");

const picturesDirectory = "./pictures";
const iPhone12Height = 569;
const iPhone12Width = 1232;
const iPhoneRatio = iPhone12Height / iPhone12Width;
const pictureDirectories = fs
  .readdirSync(picturesDirectory, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory());
const pictures = pictureDirectories.flatMap(({ name: directory }) =>
  fs.readdirSync(path.join(picturesDirectory, directory)).map((picture) => {
    const ref = path.join(directory, picture);
    const { height: pictureHeight, width: pictureWidth } = sizeOf(
      path.join(picturesDirectory, ref)
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
      ref,
      height: Math.round(pictureHeightOnIPhone),
      width: Math.round(pictureWidthOnIPhone),
    };
  })
);
const mobilePicturesDirectory = "./pictures-by-screen-size/mobile";
fs.rmdirSync(mobilePicturesDirectory, { recursive: true });
fs.mkdirSync(mobilePicturesDirectory);
pictureDirectories.forEach(({ name: directory }) =>
  fs.mkdirSync(path.join(mobilePicturesDirectory, directory))
);
pictures.forEach(({ ref, height, width }) => {
  const fileExt = path.extname(ref);
  const newFile = ref.replace(new RegExp(`${fileExt}$`), ".webp");
  sharp(path.join(picturesDirectory, ref))
    .resize(width, height)
    .webp()
    .toFile(path.join(mobilePicturesDirectory, newFile), (err) => {
      if (err) {
        console.log(err);
      }
    });
});
