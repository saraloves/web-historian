var
  path        = require('path'),
  url         = require('url'),
  fs          = require('fs'),
  helpers     = require('./http-helpers.js'),
  querystring = require('querystring'),
  urlRegex    = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;


module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.


var rootMethods = function(request, response){
  if (request.method === "OPTIONS") {
    response.writeHead(200, helpers.headers);
    response.end();
  }
  if(request.method === "POST"){
    rootMethods.post(request, response);
  }
  if (request.method === "GET"){
    helpers.serveStaticAssets("/index.html", response);
  }
};

rootMethods.post = function(request, response){
  var websiteName = "";
  request.on('data', function(chunk){
    websiteName += chunk;
  });
  request.on('end', function(){
    websiteName = querystring.parse(websiteName);
    if (urlRegex.test(websiteName.url)) {
      fs.appendFile(module.exports.datadir, websiteName.url + '\n', function(err){
        if (err) throw err;
        console.log(websiteName.url + " was saved!");
      });
      //websiteName = JSON.parse(websiteName);
      response.writeHead(201, helpers.headers);
      helpers.serveStaticAssets("/index.html", response);
    } else {
      response.writeHead(42394, helpers.headers);
      response.end('fail');
    }
  });
};

var sitesMethods = function(request, response) {
  if(request.method === "OPTIONS"){
    response.writeHead(200, helpers.headers);
    response.end();
  }
  if(request.method === "POST"){
    sitesMethods.post(request, response);
  }
  if (request.method === "GET"){
    sitesMethods.get(request, response);
  }
};

sitesMethods.get = function(request, response){
  fs.readFile(module.exports.datadir, {encoding: 'utf8'}, function(err, data){
    if(err) throw "Y U NO READ";
    response.writeHead(200, headers);
    data = data.split('\n');
    data.pop();
    response.end(JSON.stringify(data));
  });
};

var router = {
  "/": rootMethods,
  "/sites": sitesMethods
};

exports.handleRequest = function (request, response) {
  console.log("serving request type " + request.method + " for url " + request.url);
  var pathname = url.parse(request.url).pathname;
  if(router[pathname]) {
    var method = router[pathname];
    return method(request, response);
  }
  if (urlRegex.test(pathname.slice(1))) {
    if(!helpers.getFromDatabase(pathname.slice(1), response)){
      response.writeHead(200, {location: '/'});
      response.end();
    }
  }
  helpers.serveStaticAssets(pathname, response);
      // handler.handleRequest(request, response);
};

//1. check to see if there's a static serveStaticAssets
//2. check to see if the pathname matches a file we have in data/sites
//3. if it doesn't exist, it will 404