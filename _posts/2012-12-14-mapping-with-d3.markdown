---
title: Mapping with D3
layout: wide
published: true
tags: [d3]

scripts:
 - http://d3js.org/d3.v3.min.js
 - /visible-data/components/queue.js

---
<style type="text/css">

.counties path {
  stroke: #fff;
  stroke-width: .5px;
  stroke-opacity: .5;
  fill: #81abce;
}

.states {
  stroke: #fff;
  stroke-width: 1px;
  fill: none;
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

There's nothing special about this map. It's just US counties and states, with minimal interaction. I wanted to try out [D3's mapping capabilities](https://github.com/mbostock/d3/wiki/Geo-Paths), and this made for good practice.

### The Good

Creating a simple map in [D3](http://d3js.com) is remarkably easy. Assuming you have a [GeoJSON](http://geojson.org/geojson-spec.html), drawing a path is as simple as:

    var counties = map.append('g')
        .attr('class', 'counties')
      .selectAll('path')
        .data(countylines.features)
      .enter().append('path')
        .attr('d', d3.geo.path());

Where `countylines` is a GeoJSON object and `map` is an `SVG` selection. Do the same for statelines and style everything with CSS (including hover state, which is just a pseudo-class).

### The Bad

GeoJSON files can be big, and loading them can take ... awhile. In my first attempt at a simple map, I used a Census shapefile, converted to GeoJSON using `ogr2ogr`. That file weighed in at 23.42 megabytes. Yes, *megabytes*. I eventually switched to the [stripped down US counties file hosted on bl.ocks.org](http://bl.ocks.org/d/3750900/us-counties.json). Of course, it doesn't have any interesting data with it, which is part of why this map is so plain.

One possible solution to this is [TopoJSON](https://github.com/mbostock/topojson/wiki). Data can also be loaded separately in a CSV file and joined to geomtries client-side.

### The Ugly

Mapping is still hard. The fact that it's gotten easier, and keeps getting easier, to make a simple map doesn't take away from the skills required to make a decent visualization. I'm still trying to figure out what colors to use where, how to honestly represent certain kinds of data, when to use a map at all. But the barriers are definitely getting lower. More of this soon.

<script type="text/javascript">
var urls = {
	    counties: "/visible-data/data/gis/us-counties.json",
	    states: "/visible-data/data/gis/us-states.json"
	}
  , margin = { top: 0, right: 0, bottom: 0, left: 0 }
  , width = 960 - margin.right - margin.left
  , height = 500
  , path = d3.geo.path()
  , map;

var q = queue()
    .defer(d3.json, "/visible-data/data/gis/us-counties.json")
    .defer(d3.json, "/visible-data/data/gis/us-states.json")
    .await(ready);

function ready(error, countylines, statelines) {
	window.error = error;
    window.countylines = countylines;
    window.statelines = statelines;

	if (error) throw error;

    var stateIds = {};
    statelines.features.forEach(function(d) {
        stateIds[d.id] = d.properties.name;
    });

    countylines.features.forEach(function(d) {
        d.properties.state = stateIds[d.id.slice(0,2)];
    })

	// remove the loading text
	d3.select('.loading').remove();

	map = d3.select('#map').append('svg')
	    .style('width', width)
	    .style('height', height);

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

	var states = map.append('g')
	    .attr('class', 'states')
	  .selectAll('path')
	    .data(statelines.features)
	  .enter().append('path')
	    .attr('d', path);

	var caption = d3.select('#caption')
	  , starter = caption.html();

	function showCaption(d, i) {
        var name = [d.properties.name, d.properties.state].join(', ');
		caption.html(name);
	}

};

d3.selectAll('pre').attr('class', 'prettyprint');
prettyPrint();

</script>