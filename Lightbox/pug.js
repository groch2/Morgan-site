const fs = require("fs");
const path = require("path");
const pug = require('pug');

const directory = "C:\\Users\\deschaseauxr\\Documents\\Morgan-site\\pictures\\2 Dessins";
const dir = fs.readdirSync(directory);
const picturesFiles = [];
for (let picture of dir) {
    const file = path.join(directory, picture);
    picturesFiles.push(file);
}

var html = pug.renderFile('lightbox.pug', { picturesFiles, pretty: true });
fs.writeFile("lightbox.html", html, 'utf8', () => {});