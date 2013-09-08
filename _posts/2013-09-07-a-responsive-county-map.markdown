---
title: "A responsive county map"
layout: wide
published: true
comments: false
tags: []
scripts: 
 - /visible-data/components/d3/d3.min.js
 - /visible-data/components/colorbrewer/colorbrewer.js
 - /visible-data/components/underscore/underscore-min.js
 - /visible-data/components/queue-async/queue.min.js
 - /visible-data/components/topojson/topojson.min.js

styles: []
excerpt: "tl;dr"
---
<style type="text/css">
path.land {
	fill: #eee;
	stroke: #ddd;
}

path.states {
	stroke: #fff;
	stroke-width: 1.5;
	fill: none;
}

path.county {
	stroke: #fff;
	stroke-width: .75;
	fill: none;
}

</style>

<div id="map"></div>

<script type="text/javascript">
var urls = {
	data: "/visible-data/data/census/acs2011_5yr_B19058_050_in_01000US.csv",
	us: "/visible-data/data/gis/us-10m.json"
};

var margin = {top: 10, right: 10, bottom: 10, left: 10}
  , width = parseInt(d3.select('#map').style('width'), 10)
  , width = width - margin.left - margin.right
  , mapRatio = .5
  , height = width * mapRatio - margin.top - margin.bottom
  , percent = d3.format('%');

var colors = d3.scale.quantize()
	.range(colorbrewer.YlOrBr[7]);

var projection = d3.geo.albersUsa()
	.scale(width)
	.translate([width / 2, height / 2]);

var path = d3.geo.path()
	.projection(projection);

var map = d3.select('#map').append('svg')
	.style('width', width + 'px')
	.style('height', height + 'px');

queue()
	.defer(d3.json, urls.us)
	.defer(d3.csv, urls.data)
	.await(render);

function render(err, us, data) {

	window.us = us;

	var land = topojson.mesh(us, us.objects.land)
	  , states = topojson.mesh(us, us.objects.states)
	  , counties = topojson.feature(us, us.objects.counties);

	data = window.data = _(data).chain().map(function(d) {
		d.Total = +d.Total;
		d.PA_SNAP = +d["With cash public assistance or Food Stamps/SNAP"];
		d.percent = d.PA_SNAP / d.Total;
		d.id = d.GeoID.replace('05000US', '');
		return [d.id, d];
	}).object().value();

	colors.domain([
		0, 
		d3.max(d3.values(data), function(d) { return d.percent; })
	]);

	map.append('path')
		.datum(land)
		.attr('class', 'land')
		.attr('d', path);

	map.selectAll('path.county')
		.data(counties.features)
	  .enter().append('path')
	    .attr('class', 'county')
	    .attr('id', function(d) { return d.id; })
	    .attr('d', path)
	    .style('fill', function(d) {
	    	var value = data[d.id] ? data[d.id].percent : null;
	    	return colors(value);
	    });

	map.append('path')
		.datum(states)
		.attr('class', 'states')
		.attr('d', path);
}
</script>