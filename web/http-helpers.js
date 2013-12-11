var path = require('path');
var fs = require('fs');
var directory = require('./request-handler').datadir;
var mysql = require('mysql');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};


exports.serveStaticAssets = function(file, res){
  res.writeHead(200, headers);
  res.end(fs.readFileSync(__dirname + '/public' + file));
  // fs.createReadStream(path.join(__dirname, 'public' + file), {encoding: 'utf8'}).pipe(response);
};

exports.getFromDatabase = function(file, res){
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'plantlife',
    port: 3306
  });
  connection.query('use webhistorical');
  connection.query('select html from webpages where url=\'' + file + '\'', function(err, content){
    console.log('select html from webpages where url=' + file + '\'');
    if (err) throw err;
    res.writeHead(200, headers);
    res.end(content[0].html);
  });
  connection.end();
};


exports.walk = function(dir, done, base) {
  base = base || "";
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = base + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          }, base.concat(file));
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

exports.servePage = function(filename, response){
  var filePath = path.join(__dirname, "../data/sites") + filename;
  response.writeHead(200, headers);
  fs.readFile(filePath, {encoding: "utf8"}, function(err, chunk){
    if (err) throw err;
    response.write(chunk);
    response.end();
  });
};


// As you go through, keep thinking about what helper functions you can put here