const express = require('express');
const { default: ParseServer } = require('parse-server');

console.log('<== check ==>')

const parseConfig = {
  appId: '6e66d7ca36d7c271801bdada14bc9490',
  masterKey: '2d8fcc6094438a0246358cf8142e00d3',
  cloud: "./parse/cloud/index",
  serverURL: 'https://dockerhost.forge-parse-server.c66.me:40123/parse',
  publicServerURL: 'mural-palette-extention.tk.getforge.io',
};

module.exports.parseConfig = parseConfig;
module.exports.URL_SITE = 'mural-palette-extention.tk.getforge.io';


const parseServer = new ParseServer(parseConfig);
const app = new express();
app.use('/parse', parseServer.app);