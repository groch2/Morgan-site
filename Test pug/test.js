const fs = require('fs');
const path = require('path');
const pug = require('pug');

const directories = ['1 Peintures', '2 Dessins', '3 Estampes', '4 Prado & Co'];
const slideByDirectory = {};
for (let directory of directories) {
    slideByDirectory[directory] = [];
    const dir = fs.readdirSync(`../${directory}`);
    for (let picture of dir) {
        const picturePath = path.join(directory, picture);
        slideByDirectory[directory].push(picturePath);
    }
}

var html = pug.renderFile('template.pug', { slideByDirectory, pretty: true });
fs.writeFile("slide.html", html, 'utf8', () => {});