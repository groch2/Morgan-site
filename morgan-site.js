'use strict';

const express = require('express');
const basicAuth = require('express-basic-auth')
const path = require('path');
const app = express();
const { argv } = require('yargs')

app.use(basicAuth({
    users: {
        'admin': 'entrée des artistes',
    },
    challenge: true,
    realm: '812CAF04F8514B26BCF2D0029733DCA7',
}));

app.use(express.static(path.resolve(__dirname, 'dist')));

app.listen(parseInt(argv.port));