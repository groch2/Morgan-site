"use strict";

const express = require("express");
const compression = require("compression");

const app = express();

app.use(express.static("dist"));

const shouldCompress = (req, res) => {
  if (req.headers["x-no-compression"]) {
    // don't compress responses if this request header is present
    return false;
  }

  // fallback to standard compression
  const test = compression.filter(req, res);
  console.log({ test });
  return test;
};

app.use(
  compression({
    // filter decides if the response should be compressed or not,
    // based on the `shouldCompress` function above
    filter: shouldCompress,
    // threshold is the byte threshold for the response body size
    // before compression is considered, the default is 1kb
    threshold: 0,
  })
);

const port = process.env.PORT || 8080;
app.listen(port);
console.log(`listening on: ${port}`);
