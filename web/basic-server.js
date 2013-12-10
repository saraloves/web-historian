// modules and libraries
var
  http    = require("http"),
  url     = require('url'),
  path    = require('path'),
  fs      = require('fs'),
  handler = require("./request-handler"),
  helpers = require('./http-helpers.js');



var port = 8080;
var ip = "127.0.0.1";

var server = http.createServer(handler.handleRequest);

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);