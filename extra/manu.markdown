---
title: Manufacturing
layout: wide
published: true

scripts:
 - /visible-data/components/d3/d3.min.js
 - /visible-data/components/underscore/underscore-min.js
 - /visible-data/components/topojson/topojson.min.js
 - /visible-data/components/queue-async/queue.min.js
---
<style type="text/css">
<style type="text/css">
#map {
    width: 100%;
    height: 550px;
}

.states {
    fill: none;
    stroke: #ddd;
    stroke-width: 1;
}

.land {
    fill: #eee;
}

</style>

<div id="map"></div>

<script type="text/javascript">
var url = "/visible-data/data/manu-by-state.csv"
  , margins = {top: 10, right: 10, bottom: 10, left: 10}
  , width = parseInt(d3.select('#map').style('width'))
  , height = 600;

var map = d3.select('#map').append('svg')
    .style('width', width + 'px')
    .style('height', height + 'px');

var albers = d3.geo.albersUsa();

var path = d3.geo.path()
    .projection(albers);

queue()
	.defer(d3.json, '/visible-data/us.json')
	.defer(d3.csv, url)
	.await(render);

function render(err, us, gdp) {
	
	var states = topojson.feature(us, us.objects.states)
	  , land = topojson.mesh(us, us.objects.land);

	map.append('path')
	    .datum(land)
	    .attr('class', 'land')
	    .attr('d', path);

	map.selectAll('path.states')
	    .data(states.features)
	  .enter().append('path')
	    .attr('d', path)
	    .attr('class', 'states');

}

</script>