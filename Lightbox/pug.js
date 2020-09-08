const fs = require("fs");
const path = require("path");
const pug = require('pug');

const directory = "C:\\Users\\deschaseauxr\\Documents\\Morgan-site\\Thumbnails\\2 Dessins";
const dir = fs.readdirSync(directory);
const slides = [];
for (let picture of dir) {
    const picturePath = path.join(directory, picture);
    slides.push(picturePath);
}

var html = pug.renderFile('lightbox.pug', { slides, pretty: true });
fs.writeFile("lightbox.html", html, 'utf8', () => {});