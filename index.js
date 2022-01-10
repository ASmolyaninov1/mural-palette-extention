const express = require('express');
const { ParseServer } = require('@nessi/parse-server');
const Parse = require('parse/node');
const app = express();

console.log('<================ check =========>')

const api = new ParseServer({
  cloud: './cloud',
  appId: '6e66d7ca36d7c271801bdada14bc9490',
  masterKey: '2d8fcc6094438a0246358cf8142e00d3',
  serverURL: 'https://dockerhost.forge-parse-server.c66.me:40123/parse'
})

app.use('/parse', api);

app.listen(40123, function() {
  console.log('parse server running on port 1337.')
})