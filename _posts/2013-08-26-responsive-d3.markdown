---
title: "DavaViz for Everyone: Responsive Maps With D3"
layout: post
published: true
tags: [d3]
scripts:
 - /visible-data/components/d3/d3.min.js
 - /visible-data/components/d3/lib/colorbrewer/colorbrewer.js
 - /visible-data/components/underscore/underscore-min.js
 - /visible-data/components/queue-async/queue.min.js
 - /visible-data/components/topojson/topojson.min.js
 - /visible-data/components/jquery/jquery.min.js
 - /visible-data/components/bootstrap/js/tooltip.js
---

<style type="text/css">
path.land {
	fill: #eee;
	stroke: #ddd;
}

path.state {
	stroke: #eee;
	stroke-width: 1.5;
}
</style>

I spent an hour this weekend updating this site to Bootstrap 3, which means everything is now responsive (and mobile first!) by default. That means the next step is to make visualizations that can handle a browser of any size, too.

Let's make maps and charts that resize automatically and work everywhere.

## Part One: Maps ##

D3 actually makes this fairly easy.

1. Start with a responsive framework.
2. Size SVG elements based on thier containers.
3. Resize when the window size changes.

Here's a working example, using data from the new [CensusReporter](http://beta.censusreporter.org/). In this case, I'm comparing the percentage of adults over 25 years old with a bachelor's degree or higher.

<div id="map"></div>

### 1. Start with a responsive framework ###

I'm using Bootstrap, but Foundation or any other framework will do fine. Or roll your own. The point is that you want everything responding to changes in the viewport size. This makes the next step easier.

### 2. Size SVG elements based on thier containers. ###

I used to hard-code dimensions into my maps and charts. Often, this was already duplicating what I'd done in CSS, and it anchored the chart to a certain viewport size. Not on a 13-inch MacBook Pro? Tough.

Here's what I have at the top of my code now:

	var margin = {top: 10, left: 10, bottom: 10, right: 10}
	  , width = parseInt(d3.select('#map').style('width'))
	  , width = width - margin.left - margin.right
	  , mapRatio = .5
	  , height = width * mapRatio;

The `width` variable is most important here. I set it based on the computed style of the container element, in this case `#map`. Now, use this to set the scale on your map projection:

	var projection = d3.geo.albersUsa()
	    .scale(width)
	    .translate([width / 2, height / 2]);

	var path = d3.geo.path()
	    .projection(projection);

This gets us 90% of the way to responsiveness, because the map will be rendered at the right size on load. Pull this up on your phone, and it'll fit. Same for your giant desktop.

But it won't adjust if you rotate your phone (or tablet). As much as web developers are the only people who test the responsiveness of sites by resizing with the mouse, real users really do turn their devices sideways (even by accident). And it's no fun reloading a bunch of GIS data on your phone.

### 3. Resize when the window size changes. ###

This turns out to be simpler than I expected. You need to catch `window.onresize`, and you need to resize the map. Do this by recalculating the container size, adjusting the projection's scale, then re-running the function that originally drew the map. Here's the code:

	d3.select(window).on('resize', resize);

	function resize() {
	    // adjust things when the window size changes
	    width = parseInt(d3.select('#map').style('width'));
	    width = width - margin.left - margin.right;
	    height = width * mapRatio;

	    // update projection
	    projection
	        .translate([width / 2, height / 2])
	        .scale(width);

	    // resize the map container
	    map
	        .style('width', width + 'px')
	        .style('height', height + 'px');

	    // resize the map
	    map.select('.land').attr('d', path);
	    map.selectAll('.state').attr('d', path);
	}

The reason the last two lines work is D3's data-binding. Remember, each selection is bound to an array of data, and each datum is stored on a corresponding element as `__data__`. This means you can access it later by simply reselecting the elements, and you can use it by re-setting the `d` attribute.

<script type="x-jst" id="tooltip-template">
<h5><%= Name %></h5>
<p><%= formats.percent(percent) %> have a BA degree or higher.</p>
</script>

<script type="text/javascript">
var urls = {
	us: "/visible-data/data/us.json",
	data: "/visible-data/data/census/bachelors-degrees.csv"
};

var margin = {top: 10, left: 10, bottom: 10, right: 10}
  , width = parseInt(d3.select('#map').style('width'))
  , width = width - margin.left - margin.right
  , mapRatio = .5
  , height = width * mapRatio;

var formats = {
	percent: d3.format('%')
};

// projection and path setup
var projection = d3.geo.albersUsa()
    .scale(width)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

// scales and axes
var colors = d3.scale.quantize()
	.range(colorbrewer.Greens[7]);

// make a map
var map = d3.select('#map').append('svg')
    .style('height', height);

// queue and render
queue()
	.defer(d3.json, urls.us)
	.defer(d3.csv, urls.data)
	.await(render);

// catch the resize
d3.select(window).on('resize', resize);

// template, for later
var template = _.template(d3.select('#tooltip-template').html());

function render(err, us, data) {

	var land = topojson.mesh(us, us.objects.land)
	  , states = topojson.feature(us, us.objects.states);

	window.us = us;

	data = window.data = _(data).chain().map(function(d) {
		d.Total = +d.Total;
		d["Bachelor's degree"] = +d["Bachelor's degree"];
		d.percent = d["Bachelor's degree"] / d.Total;
		return [d.Name, d];
	}).object().value();

	colors.domain([
		0, 
		d3.max(d3.values(data), function(d) { return d.percent; })
	]);

	map.append('path')
		.datum(land)
		.attr('class', 'land')
		.attr('d', path);

	var states = map.selectAll('path.state')
	    .data(states.features)
	  .enter().append('path')
	    .attr('class', 'state')
	    .attr('id', function(d) { 
	    	return d.properties.name.toLowerCase().replace(/\s/g, '-'); 
	    })
	    .attr('d', path)
	    .style('fill', function(d) {
	    	var name = d.properties.name
	    	  , value = data[name] ? data[name].percent : null;

	    	return colors(value);
	    });

	states.on('mouseover', tooltipShow)
		.on('mouseout', tooltipHide);

}

function resize() {
    // adjust things when the window size changes
    width = parseInt(d3.select('#map').style('width'));
    width = width - margin.left - margin.right;
    height = width * mapRatio;

    // update projection
    projection
        .translate([width / 2, height / 2])
        .scale(width);

    // resize the map container
    map
        .style('width', width + 'px')
        .style('height', height + 'px');

    // resize the map
    map.select('.land').attr('d', path);
    map.selectAll('.state').attr('d', path);
}

function tooltipShow(d, i) {
	var datum = data[d.properties.name];
	if (!datum) return;

	datum.formats = formats;

	$(this).tooltip({
		title: template(datum),
		html: true,
		container: map.node().parentNode,
		placement: 'auto'
	}).tooltip('show');
}

function tooltipHide(d, i) {
	$(this).tooltip('hide');
}


</script>