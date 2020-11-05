"use strict";

const express = require("express");
const basicAuth = require("express-basic-auth");

const app = express();

app.use(
  basicAuth({
    users: {
      admin: "entrée des artistes",
    },
    challenge: true,
    realm: "812CAF04F8514B26BCF2D0029733DCA7",
  })
);

app.use(express.static("dist"));

const port = process.env.PORT || 8080;
app.listen(port);
