var fs = require('fs');


var walk = function(dir, done, base) {
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

exports.walk = walk;