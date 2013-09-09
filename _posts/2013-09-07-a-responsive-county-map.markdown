---
title: "Public Assistance and Food Stamp Participation"
layout: wide
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

styles: []
excerpt: "A (responsive) county-by-county look at public aid participation in the United States"
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

Thirteen million American households receive some form of welfare or food stamps, and [that number is growing](http://www.nytimes.com/2013/09/05/us/as-debate-reopens-food-stamp-recipients-continue-to-squeeze.html?pagewanted=all).

In some counties, more than half of households receive benefits. In the map below, I'm showing the percent of households that received cash assistance or food stamps in the last year, using [Census data](http://beta.censusreporter.org/compare/01000US/050/map/?release=acs2011_5yr&table=B19058#).

<div id="map">
	<div id="legend"></div>
</div>


<script type="x-jst" id="tooltip-template">
<h5><%= Name %></h5>
<p><%= format(percent) %> of households received public
assistance income or food stamps in the Past 12 Months.</p>
</script>

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
	.domain([0, .5])
	.range(colorbrewer.YlOrBr[5]);

var projection = d3.geo.albersUsa()
	.scale(width)
	.translate([width / 2, height / 2]);

var path = d3.geo.path()
	.projection(projection);

var map = d3.select('#map').append('svg')
	.style('width', width + 'px')
	.style('height', height + 'px');

var template = _.template(d3.select('#tooltip-template').html());

queue()
	.defer(d3.json, urls.us)
	.defer(d3.csv, urls.data)
	.await(render);


function render(err, us, data) {

	window.us = us;

	var land = topojson.mesh(us, us.objects.land)
	  , states = topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })
	  , counties = topojson.feature(us, us.objects.counties);

	data = window.data = _(data).chain().map(function(d) {
		d.Total = +d.Total;
		d.PA_SNAP = +d["With cash public assistance or Food Stamps/SNAP"];
		d.percent = d.PA_SNAP / d.Total;
		d.id = +d.GeoID.replace('05000US', '');
		return [d.id, d];
	}).object().value();

	map.append('path')
		.datum(land)
		.attr('class', 'land')
		.attr('d', path);

	var counties = map.selectAll('path.county')
		.data(counties.features)
	  .enter().append('path')
	    .attr('class', 'county')
	    .attr('id', function(d) { return d.id; })
	    .attr('d', path)
	    .style('fill', function(d) {
	    	var value = data[d.id] ? data[d.id].percent : null;
	    	return colors(value);
	    });

	counties
		.on('mouseover', tooltipShow)
        .on('mouseout', tooltipHide);

	map.append('path')
		.datum(states)
		.attr('class', 'states')
		.attr('d', path);

	var legend = d3.select('#legend')
	  .append('ul')
	    .attr('class', 'list-inline');

	var keys = legend.selectAll('li.key')
	    .data(colors.range())
	  .enter().append('li')
	    .attr('class', 'key')
	    .style('border-top-color', String)
	    .text(function(d) {
	        var r = colors.invertExtent(d);
	        return percent(r[0]);
	    });

}

d3.select(window).on('resize', _.throttle(resize, 50));

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
    map.select('.states').attr('d', path);
    map.selectAll('.county').attr('d', path);
}

function tooltipShow(d, i) {
    var datum = data[d.id];
    if (!datum) return;

    datum.format = percent;

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