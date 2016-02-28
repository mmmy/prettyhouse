var categoryTitleChart = dc.rowChart('#category_title'),
	categoryPriceChart = dc.rowChart('#category_price'),
	categoryTotalChart = dc.rowChart('#category_total'),
	categoryTypeChart = dc.pieChart('#category_type'),
	priceChart = dc.barChart('#price-dimension'),
	totalChart = dc.barChart('#total-dimension');
	//dataTableChart = dc.dataTable('#dc_data_table');

var category = {
	'GOOD':'信息完整',
	'NO_TITLE':'无标题',
	'NO_PRICE':'无价格',
	'NO_TOTAL':'无数量'
};

var gridOptions = null;
var map = null;
var markers = [];
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
			priceDimension 	= houses.dimension(function(d){ return Math.round(d.price/1000); }),
			totalDimension 	= houses.dimension(function(d){ return Math.round(d.total/10); });

		var priceCountGroup = priceDimension.group(),
		    totalCountGroup = totalDimension.group();

		var hasTitleDimension = houses.dimension(function(d){ return d.title ? '有标题':'无' }),
			hasPriceDimension = houses.dimension(function(d){ return d.price ? '有价格':'无'}),
			hasTotalDimension = houses.dimension(function(d){ return d.total ? '有套数':'无'}),
			typeDimension = houses.dimension(function(d){ return d.propertyType; });

		var hasTitleCountGroup = hasTitleDimension.group(),
			hasPriceCountGroup = hasPriceDimension.group(),
			hasTotalCountGroup = hasTotalDimension.group(),
			typeCountGroup = typeDimension.group();

		window.house = houses;
		window.priceDimension = priceDimension;
		window.totalDimension = totalDimension;


		categoryTitleChart.width(250).height(100)
							.dimension(hasTitleDimension)
							.group(hasTitleCountGroup)
							 .elasticX(true);
		categoryTitleChart.xAxis().ticks(4);
		categoryTitleChart.filter('有标题');

		categoryPriceChart.width(250).height(100)
							.dimension(hasPriceDimension)
							.group(hasPriceCountGroup)
							.elasticX(true);
		categoryPriceChart.xAxis().ticks(4);
		categoryPriceChart.filter('有价格');

		categoryTotalChart.width(250).height(100)
							.dimension(hasTotalDimension)
							.group(hasTotalCountGroup)
							.elasticX(true);
		categoryTotalChart.xAxis().ticks(4);
		categoryTotalChart.filter('有套数');

		categoryTypeChart.width(400).height(300)
							.dimension(typeDimension)
							.group(typeCountGroup).
							innerRadius(50);
							

		priceChart.width(1000)
					.height(200)
					.x(d3.scale.linear().domain([0, 100]))
					.dimension(priceDimension)
					.group(priceCountGroup)
					//.innerRadius(50);

		totalChart.width(1000)
					.height(200)
					.x(d3.scale.linear().domain([0, 150]))
					//.elasticY(true)
					//.controlsUseVisibility(true)
					.brushOn(true)
					.dimension(totalDimension)
					.group(totalCountGroup);
		// var n = 0;
		// var rrr = function(d){return n++};
		// window.dataTableChart = dataTableChart.width(1000).height(400)
		// 				.dimension(priceDimension)
		// 				.group(function(d){ return d.title; })
		// 				.size(Infinity)
		// 				.columns([function(d){ return d.title },rrr])
		// 				.sortBy(function(d){ return d.title })
		// 				.order(d3.ascending);


		dc.renderAll();
		drawTable(priceDimension.top(Infinity));
		var onFilter = function(chart, filter){
			console.log(chart, filter, '11111');
			//dataSet = priceDimension.top(Infinity);
			drawTable(priceDimension.top(Infinity));
		};
		categoryTitleChart.on('filtered', onFilter);
		categoryPriceChart.on('filtered', onFilter);
		categoryTotalChart.on('filtered', onFilter);
		categoryTypeChart.on('filtered', onFilter);
		priceChart.on('filtered', onFilter);
		totalChart.on('filtered', onFilter);
	});
});
function renderAverage(jsonData){
	var total=0, count=0;
	jsonData.forEach(function(e, i){
		if(e.total && e.price){
			total += e.total * e.price;
			count += e.total;
		}
	});
	document.querySelector('#average_price').innerHTML = (total/count).toFixed(0) + ' 元/平方米';
}
function drawMap(jsonData) {
	 if(!map){
	 	map =  new AMap.Map('map_container', {
	        resizeEnable: true,
	        center: [116.397428, 39.90923],
	        zoom: 13
	    });    
	 }
	 map.remove(markers);
	 markers = [];
	 jsonData.forEach(function(e,i){
	 	if(e.lng && e.lat){
	 		markers.push(new AMap.Marker({
	 			map:map,
	 			position:[e.lng, e.lat]
	 		}));
	 	}
	 });
	 map.setFitView();
}
function drawTable (jsonData) {
	setTimeout(function(){
		renderAverage(jsonData);	
	}, 0);
	setTimeout(function(){
		drawMap(jsonData);
	}, 0)
	  var columnDefs = _.keys(jsonData[0] && jsonData[0]).map(function(key){ return {headerName:key, field:key}; });
	  //jsonData = [{title:'a'},{title:'b'}];
	  //var columnDefs = [{headerName:'Title', field:'title'}];
	  columnDefs.unshift({headerName: "#", width: 50, cellRenderer: function(params) {
        return params.node.id + 1;
    	} });
	  var dataTable = document.querySelector('#data_table');
	  var dataSource = {
		//rowCount: null, // behave as infinite scroll
        pageSize: 100,
        overflowSize: 100,
        maxConcurrentRequests: 2,
        maxPagesInCache: 2,
        getRows: function (params) {
            console.log('asking for ' + params.startRow + ' to ' + params.endRow);
            // At this point in your code, you would call the server, using $http if in AngularJS.
            // To make the demo look real, wait for 500ms before returning
            setTimeout( function() {
                // take a slice of the total rows
                var rowsThisPage = jsonData.slice(params.startRow, params.endRow);
                // if on or after the last page, work out the last row.
                var lastRow = -1;
                if (jsonData.length <= params.endRow) {
                    lastRow = jsonData.length;
                }
                // call the success callback
                params.successCallback(rowsThisPage, lastRow);
            }, 100);
        }
      };
      if(window.gridOptions){
      	window.gridOptions.api.setDatasource(dataSource);
      	//window.dataSource.api.refreshView();
      	return;
      }
	  var gridOptions = {
	    enableColResize: true,
	    virtualPaging: true, // this is important, if not set, normal paging will be done
	    rowSelection: 'single',
	    rowDeselection: true,
	    columnDefs: columnDefs,
	    datasource: dataSource
	};
	new agGrid.Grid(dataTable, gridOptions);
	gridOptions.api.setDatasource(dataSource);
	window.gridOptions = gridOptions;
}
// function drawTable(jsonArr){
// 	if(jsonArr.length < 1) return;
// 	var columns = _.keys(jsonArr[0]).map(function(key){ return {'title': key}; });
// 		columns = columns.slice(0, columns.length-2);
// 	var data = jsonArr.map(function(obj){
// 		var values = _.values(obj);
// 		return values.slice(0, values.length-2);
// 	});
// 	if($.fn.dataTable.isDataTable('#data_table')) $('#data_table').DataTable().destroy().draw();
// 	window.dataTalbe = $('#data_table').DataTable({
// 			'data': data,
// 			"columns": columns,
// 			'scrollY': '400px',
// 			'scrollCollapse': true,
// 			'paging': true,
// 			'scroller': true
// 	});
// }