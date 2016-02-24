var express = require('express');
var app = express();

var port = process.argv[2] || 8080;

app.get('/'. function(req, res){
	
});

app.listen(port, function(){
	console.log('listening on port: ', port);
});