var priceChart = dc.pieChart('#price-dimension'),
	totalChart = dc.barChart('#total-dimension');
$(function(){
	d3.csv('../data/cities/2016-1-23/深圳.csv', function(error,data){
		error && console.log(error);
		data.forEach(function(e, i){
			e.total 		&& 	(e.total 		= parseInt(e.total));
			e.completion 	&& 	(e.completion 	= new Date(e.completion));
			e.price 		&& 	(e.price 		= parseInt(e.price));
			e.parking 		&& 	(e.parking 		= parseInt(e.parking));
			e.gfa 			&& 	(e.gfa 			= parseInt(e.gfa));
			e.volumeRate	&& 	(e.volumeRate 	= parseFloat(e.volumeRate));
			e.propertyCosts	&& 	(e.propertyCosts = parseFloat(e.propertyCosts));
			e.lat			&& 	(e.lat 			= parseFloat(e.lat));
			e.lng			&& 	(e.lng 			= parseFloat(e.lng));
			e.greeningRate	&& 	(e.greeningRate = parseFloat(e.greeningRate)/100);
			e.images 		&& 	(e.images 		= JSON.parse(e.images));
		});
		console.log(data);

		var houses 			= crossfilter(data),
			priceDimension 	= houses.dimension(function(d){ return Math.round(d.price/1000) * 1000; }),
			totalDimension 	= houses.dimension(function(d){ return Math.round(d.total/100) * 100; });

		var priceCountGroup = priceDimension.group();
		var totalCountGroup = totalDimension.group();
		window.house = houses;
		window.priceDimension = priceDimension;
		window.totalDimension = totalDimension;

		priceChart.width(400)
					.height(400)
					.dimension(priceDimension)
					.group(priceCountGroup)
					.innerRadius(50);
		priceChart.render();

		totalChart.width(500)
					.height(200)
					.x(d3.scale.linear().domain([0, 1000]))
					//.elasticY(true)
					//.controlsUseVisibility(true)
					.brushOn(true)
					.dimension(totalDimension)
					.group(totalCountGroup);
		totalChart.render();


	});
});