const fs = require("fs");
const path = require("path");

console.debug(fs.readdir("./pictures", { withFileTypes: true }, ((_, f) => null)));
