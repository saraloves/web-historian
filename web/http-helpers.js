var path = require('path');
var fs = require('fs');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveStaticAssets = function(res, folder, asset) {
  //Write some code here that helps serve up your static files!
  //(Static files are things like html (yours or arhived from others...), css, or anything that doesn't change often.)
};

// As you go through, keep thinking about what helper functions you can put here!