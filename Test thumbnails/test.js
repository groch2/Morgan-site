const fs = require("fs");
const path = require("path");
const pug = require("pug");

const paintingsDirectory =
  "C:/Users/deschaseauxr/Documents/Morgan-site/pictures/1 Peintures";
const paintings = new Set(
  fs
    .readdirSync(paintingsDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => path.parse(dirent.name).name)
);
const distDirectory = "C:/Users/deschaseauxr/Documents/Morgan-site/dist";
console.debug(paintings);
const paintingFiles = fs
  .readdirSync(distDirectory, {
    withFileTypes: true,
  })
  .filter(
    (dirent) => dirent.isFile() && paintings.has(path.parse(dirent.name).name)
  )
  .map((f) => path.join(distDirectory, f.name));

var html = pug.renderFile("thumbnails.pug", { paintingFiles });
fs.writeFile("thumbnails.html", html, "utf8", () => {});
