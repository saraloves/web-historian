// modules and libraries
var 
  http    = require("http"),
  url     = require('url'),
  path    = require('path'),
  fs      = require('fs'),
  handler = require("./request-handler"),
  helpers = require('./server-helpers.js');

var port = 8080;
var ip = "127.0.0.1";

var serveStaticFile = function(file, response){
  fs.createReadStream(path.join(__dirname, 'public' + file), {encoding: 'utf8'}).pipe(response);
};

var server = http.createServer(function(request, response){
  helpers.walk(path.join(__dirname, 'public'), function(err, list){
    var pathname = url.parse(request.url).pathname
    if(list.indexOf(pathname > 0)){
      serveStaticFile(pathname, response);
    } else {
      // router
    }
  })
});

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);