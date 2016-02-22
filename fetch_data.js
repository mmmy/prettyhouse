var fs = require('fs');
var http = require('http');
var urlencode = require('urlencode')
var pkg = require('./package.json');

var citys = process.argv.length > 2 ? process.argv.slice(2) : pkg.citys ;

console.log(citys);

var getCityAllData = function(cityName){
	cityName = urlencode(cityName, 'utf8');
	var url = "http://v.juhe.cn/estate/query?city=" + cityName + "&q=&page=&dtype=&key=44e487fceb1918419da1fe9a2c090f6b";
	http.get(url, function(res){
		res.on('data', (chunk) => {
		    console.log(chunk.toString());
		  });
		  res.on('end', () => {
		    console.log('No more data in response.')
		  })
	}).on('error', function(e){
		console.error(e);
	});
};

getCityAllData("深圳");