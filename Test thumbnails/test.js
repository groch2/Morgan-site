const fs = require("fs");
const path = require("path");
const pug = require('pug');

const directory = "C:\\Users\\deschaseauxr\\Documents\\Morgan-site\\Thumbnails\\1 Peintures";
const dir = fs.readdirSync(directory);
const thumbnails = [];
for (let picture of dir) {
    const picturePath = path.join(directory, picture);
    thumbnails.push(picturePath);
}

var html = pug.renderFile('thumbnails.pug', { thumbnails, pretty: true });
fs.writeFile("thumbnails.html", html, 'utf8', () => {});