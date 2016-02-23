var fs = require('fs');
var http = require('http');
var csv = require('csv');
var urlencode = require('urlencode')
var pkg = require('./package.json');

var cities = process.argv.length > 2 ? process.argv.slice(2) : pkg.cities ;
console.log(cities);

var citiesPath = './data/cities/';
var generateDateString = function(){
	var date = new Date();
	return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
};
var fileDir = citiesPath + generateDateString() + '/';



var getCityAllData = function(cityName){
	cityNameEcode = urlencode(cityName, 'utf8');
	var generateUrl = function(page){ 
		return "http://v.juhe.cn/estate/query?city=" + cityNameEcode + "&q=&dtype=&key=44e487fceb1918419da1fe9a2c090f6b&page=" + page;
	};

	var pageFile = fileDir + cityName + '.page';
	!fs.existsSync(fileDir) && fs.mkdirSync(fileDir);
	!fs.existsSync(pageFile) && fs.writeFileSync(pageFile, 1);

	var getData = function(page, onPage, cb) {
		//if(page>4) return;
		http.get(generateUrl(page), function(res){
			if(res.statusCode != 200){
				return;
			} 
			var responseStr = '';
			res.on('data', (chunk) => {
			    responseStr += chunk.toString();			    
			 });
			res.on('error',function(e){
				console.log(e);
			});
			res.on('end', () => {
				console.log('end');
			    var jsondata = JSON.parse(responseStr);
			    if(jsondata.result && (jsondata.result.length > 0)){
			    	onPage(jsondata.result, page);
			    	getData(page+1, onPage, cb);
			    	console.log('page:',page);
			    }else{
			    	cb();
			    }
			});
		}).on('error', function(e){
			console.error(e);
		});
	}

	getData(+fs.readFileSync(pageFile), function(data, page){
		csv.stringify(data, function(err, output){
			fs.appendFileSync(fileDir + cityName + '.csv', output);
		});
		fs.writeFileSync(pageFile, page+1);
	}, function(){
		//console.log(data.length);
		console.log('finish');
		//fs.writeFileSync(fileDir + cityName + '.json', JSON.stringify(data));
	});
};

getCityAllData(cities[0]);