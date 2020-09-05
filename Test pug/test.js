const fs = require('fs');
const path = require('path');
const pug = require('pug');

const directories = ["1 Peintures", "2 Dessins", "3 Estampes", "4 Prado & Co"];
const homeLinks = directories.map(n => /(?<=^\d+\s).+$/.exec(n)[0]);
homeLinks.unshift("Home");

var html = pug.renderFile('template.pug', { homeLinks, pretty: true });
fs.writeFile("home.html", html, 'utf8', () => {});