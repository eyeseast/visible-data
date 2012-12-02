---
title: Mapping with D3
layout: wide
published: true
tags: [d3]

scripts:
 - https://raw.github.com/mbostock/d3/master/d3.v2.min.js
 - /visible-data/components/queue.js

---
<style type="text/css">

.counties {
  stroke: #fff;
  stroke-width: .5px;
  stroke-opacity: .5;
  fill: #4d4d4d;
}

.states {

}

.counties path:hover {
  fill: Steelblue;
}

</style>

Trying out D3's geographic features.

<h3 id="caption">Hover over a county:</h3>

<div id="map">
	<h4 class="loading">Loading...</h4>
</div>

<script type="text/javascript">
var urls = {
	    counties: "/visible-data/data/gis/us-counties.json",
	    states: "/visible-data/data/gis/us-states.json"
	}
  , margin = { top: 0, right: 0, bottom: 0, left: 0 }
  , width = 960 - margin.right - margin.left
  , height = 600
  , path = d3.geo.path()
  , map;

function cb(n) {
	return function() {
		console.log(n);
		console.log(arguments);
	}
}

var q = queue()
    .defer(d3.json, "/visible-data/data/gis/us-counties.json")
    .defer(d3.json, "/visible-data/data/gis/us-states.json")
    .await(cb('await'));

function ready(error, countylines, statelines) {
	// window.error = error;

	if (error) {
		console.log(error);
		console.log(arguments);
		return;
	}

	// remove the loading text
	d3.select('.loading').remove();

	map = d3.select('#map').append('svg')
	    .style('width', width);
	    //.style('height', height);

	var counties = map.append('g')
	    .attr('class', 'counties')
	  .selectAll('path')
	    .data(countylines.features)
	  .enter().append('path')
	    .attr('d', path);

	counties.on('mouseover', showCaption)
	    .on('mousemove', showCaption)
	    .on('mouseout', function() {
	    	caption.html(starter);
	    });

	/***
	var states = map.append('g')
	    .attr('class', 'states')
	  .selectAll('path')
	    .data(statelines.features)
	  .enter().append('path')
	    .attr('d', path);
	***/

	var caption = d3.select('#caption')
	  , starter = caption.html();

	function showCaption(d, i) {
		// window.county = d;
		// var name = [d.properties.NAME, d.properties.LSAD].join(' ');
		caption.html(d.properties.name);
	}

};

</script>