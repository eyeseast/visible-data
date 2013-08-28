---
title: Responsive Legends with D3
layout: post
published: true
comments: false
tags: [d3]
scripts:
 - /visible-data/components/d3/d3.min.js
 - /visible-data/components/colorbrewer/colorbrewer.js
 - /visible-data/components/underscore/underscore-min.js
 - /visible-data/components/queue-async/queue.min.js
 - /visible-data/components/topojson/topojson.min.js
 - /visible-data/components/jquery/jquery.min.js
 - /visible-data/components/bootstrap/js/tooltip.js
 - /visible-data/components/highlightjs/highlight.pack.js

styles:
 - /visible-data/components/highlightjs/styles/default.css

excerpt: "Legends are tricky."
---

<style type="text/css">
#legend {
	padding: 1.5em 0 0 1.5em;
}

li.key {
	border-top-width: 15px;
	border-top-style: solid;
	font-size: .75em;
	width: 10%;
	padding-left: 0;
	padding-right: 0;
}

path.land {
	fill: #eee;
	stroke: #ddd;
}

path.state {
	stroke: #eee;
	stroke-width: 1;
}
</style>


<div id="map">
	<div id="legend">
		<small>Percent of adults over 25 with at least a bachelor's degree</small>
	</div>
</div>

<script type="x-jst" id="tooltip-template">
<h5><%= Name %></h5>
<p><%= formats.percent(percent) %> have a BA degree or higher.</p>
</script>

<script type="text/javascript">
var urls = {
	us: "/visible-data/data/us.json",
	data: "/visible-data/data/census/bachelors-degrees.csv"
};

var margin = {top: 0, left: 0, bottom: 0, right: 0}
  , width = parseInt(d3.select('#map').style('width'))
  , width = width - margin.left - margin.right
  , mapRatio = .55
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
    .style('height', height + 'px')
    .style('width', width + 'px');

// template, for later
var template = _.template(d3.select('#tooltip-template').html());

// start the legend
var legend = d3.select('#legend')
  .append('ul')
    .attr('class', 'list-inline');

// catch the resize
d3.select(window).on('resize', resize);

// queue and render
queue()
	.defer(d3.json, urls.us)
	.defer(d3.csv, urls.data)
	.await(render);

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

	colors.domain(
		d3.extent(d3.values(data), function(d) { return d.percent; })
	);

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

	legend.append('ul')
	    .attr('class', 'list-inline');
	
	var keys = legend.selectAll('li.key')
	    .data(colors.range());
	
	keys.enter().append('li')
	    .attr('class', 'key')
	    .style('border-top-color', String)
	    .text(function(d) {
	    	var r = colors.invertExtent(d);
	        return formats.percent(r[0]) + ' - ' + formats.percent(r[1]);
	    });

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

// highlight my code blocks
d3.selectAll('pre code').each(function() {
	var code = d3.select(this)
	  , highlight = hljs.highlight('javascript', code.html());

	code.html(highlight.value);
});

</script>