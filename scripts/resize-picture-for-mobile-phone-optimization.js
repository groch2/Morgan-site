"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const picturesDirectory = "./pictures";
const pictures = fs
  .readdirSync(picturesDirectory, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .flatMap(({ name: directory }) =>
    fs
      .readdirSync(path.join(picturesDirectory, directory))
      .map((picture) => path.join(directory, picture))
  );

console.debug({ pictures });
