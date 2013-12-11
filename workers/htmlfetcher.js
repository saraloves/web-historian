// eventually, you'll have some code here that uses the tested helpers 
// to actually download the urls you want to download.

var path   = require('path');
var fs     = require('fs');
var http   = require('http');
var mysql  = require('mysql');
var moment = require('moment');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'plantlife',
  port: 3306
});

connection.query('use webhistorical');

var readUrls = function(filepath, callback){
  fs.readFile(filepath, {encoding: 'utf8'}, function(err, data){
    if (err) throw err;
    data = data.split('\n');
    data.pop();
    callback(data);
  });
};

var downloadUrls = function(sitesArray){
  sitesArray.forEach(function(site){
    var options = {
      host: site
    };
    var req = http.request(options, function(res){
      var html = "";
      res.on('data', function(chunk){
        html += chunk;
      });
      res.on('end', function(){
        // fs.writeFile(path.join(__dirname, '../data/sites/' + site), html, function (err) {
        //   if (err) throw err;
        //   console.log('It\'s saved!');
        // });

        connection.query('insert into webpages (url, html, createdAt) value(' + mysql.escape(site) + ', ' + mysql.escape(html) + ', ' + moment().format('YYYY-MM-DD') + ');', function(err){
          console.log('insert into webpages (url, html, createdAt) value(' + mysql.escape(site) + ', html,\'' + moment().format('YYYY-MM-DD') + '\')');
          if(err) throw err;
        });
      });
    });
    req.end();
  });
};

var escapeHtml = function(str) {
  var escapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };
  return String(str).replace(/[&<>"'\/]/g, function(s) {
    return escapeMap[s];
  });
};

readUrls(path.join(__dirname, '../data/sites.txt'), downloadUrls);


exports.readUrls = readUrls;