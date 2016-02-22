var fs = require('fs');
var http = require('http');
var pkg = require('./package.json');

var citys = process.argv.length > 2 ? process.argv.slice(2) : pkg.citys ;

console.log(citys);