var http = require("http");
var handler = require("./request-handler");
var helper = require("./http-helpers");
var servIndex = require('./http-helpers').servIndex;
var serveStaticAssets = require('./http-helpers').serveStaticAssets;
var headers = require('./http-helpers').headers;

var port = 8080;
var ip = "127.0.0.1";
var router = {
	"/":servIndex,
	"/styles.css": serveStaticAssets,
	"/favicon.ico": serveStaticAssets
}
var server = http.createServer(function(request, response) {
	console.log("request url is: " + request.url);
	if (router[request.url] === undefined) {
		handleRequest(request, response);
	} else {
		router[request.url](request, response, headers);
	}
});
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
