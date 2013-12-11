var path = require('path');
var fs = require('fs');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.servIndex = function(request, response, headers){
  fs.readFile('public/index.html', function(err, content) {
    headers['Content-Type'] = "text/html";
    console.log(err);
    response.writeHead(200, headers);
    response.write(content);
    console.log(response);
    response.end();
  });
};

exports.serveStaticAssets = function(request, response, headers) {
  fs.readFile('public/styles.css', function(err, content) {
    headers['Content-Type'] = "text/css";
    console.log(err);
    response.writeHead(200, headers);
    response.write(content);
    response.end();
  });
  //Write some code here that helps serve up your static files!
  //(Static files are things like html (yours or arhived from others...), css, or anything that doesn't change often.)
};

exports.headers = headers;

// As you go through, keep thinking about what helper functions you can put here!