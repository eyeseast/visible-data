---
title: Partisanship Over 111 Senates
layout: post
published: true
tags: [d3, underscore, crossfilter]

scripts:
 - http://d3js.org/d3.v2.min.js
 - http://documentcloud.github.com/underscore/underscore-min.js
 - https://raw.github.com/square/crossfilter/master/crossfilter.min.js
 - /visible-data/js/parties.js
 - http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
 - /visible-data/js/jquery-ui/js/jquery-ui-1.8.20.custom.min.js

styles:
 - /visible-data/js/jquery-ui/css/smoothness/jquery-ui-1.8.20.custom.css

---
<style type="text/css">
body { position: relative; }
svg {
	font-family: sans-serif;
	font-size: 10px;
}
g.axis path {
	fill: none;
	stroke: #444;
	stroke-width: .5;
}

svg circle {
	stroke: #444;
	stroke-width: .5;
	fill: white;
}

svg circle.democrat {
	fill: SteelBlue;
}

svg circle.republican {
	fill: FireBrick;
}

div.caption {
	padding: 1em;
	background-color: white;
	border: 1px solid #333;
}

#congress {
	margin-left: 20px;
}
</style>

Following up on my post about partisanship in the 111th US Senate, I wanted to look at how alliances have shifted over the history of Congress.

<div id="chart-wrapper">
	<div id="chart"> </div>
	<div class="row">
		<div id="slider" class="span6"> </div>
		<input type="number" min="1" max="111" id="congress" class="span1" value="111" />
	</div>
</div>

<script type="text/javascript">
// mise en place
function slugify(text) {
	text = String(text)
	    .toLowerCase()
	    .replace(/[^\w\s-]/, '')
	    .replace(/[-\s]+/, '-');
	return text;
}

var height = 400,
    width = 600,
    pad = 20;

var chart = d3.select('#chart').append('svg')
    .attr('height', height + pad)
    .attr('width', width + pad)
  .append('g')
    .attr('transform', 'translate(' + pad + ',0)');

var x = d3.scale.linear()
    .domain([-1.5, 1.5])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([-1.5, 1.5])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(3)
    .tickFormat(String)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(3)
    .tickFormat(String)
    .orient('left');

// crossfilter
var scores = crossfilter(),
    byCongress = scores.dimension(function(d) { return d.Congress; });

// the chart
chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

chart.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

// a caption, for use later
var caption = d3.select('body').append('div')
    .attr('class', 'caption')
    .style('display', 'none')
    .style('position', 'absolute');

function plotCongress(congress) {
	var data = byCongress.filter(congress);
	var circles = chart.selectAll('circle')
	    .data(data.top(Infinity), function(d) { return d['Name']; });
	
	circles.enter()
	    .append('circle')
	    .attr('class', function(d) { return d['slug']; })
	    .attr('cx', function(d) { return x(d['1st Dimension Coordinate']); })
	    .attr('cy', function(d) { return y(d['2nd Dimension Coordinate']); })
	  .transition()
	    .duration(1000)
	    .attr('r', 5);

    circles.transition()
        .duration(1000)
        .attr('class', function(d) { return d['slug']; })
        .attr('r', 5)
        .attr('cx', function(d) { return x(d['1st Dimension Coordinate']); })
        .attr('cy', function(d) { return y(d['2nd Dimension Coordinate']); });

	circles.exit()
	    .transition()
	    .duration(1000)
	    .attr('r', 0)
	    .remove();

	circles.on('mouseover', function(d, i) {
		var position = d3.mouse(document.body);
		this.setAttribute('r', 10);
		caption.style('display', 'block')
			.style('left', (position[0] + 10) + 'px')
			.style('top', (position[1] + 10) + 'px')
			.text(d['Name'] + ': ' + d['1st Dimension Coordinate']);
	})
	.on('mouseout', function(d, i) {
		this.setAttribute('r', 5);
		caption.style('display', 'none');
	});

}

jQuery(function($) {
	var congress = $('#congress');
	window.slider = $('#slider').slider({
		min: 1,
		max: 111,
		value: 111,
		change: function(e, ui) {
			plotCongress(ui.value);
		},
		slide: function(e, ui) {
			congress.val(ui.value);
		}
	});

	congress.on('change', function(e) {
		var value = $(this).val();
		slider.slider('value', value);
	})
});

d3.csv('/visible-data/data/DWN-master.csv', function(data) {
	// a little data cleaning
	window.data = data;
	_.each(data, function(d, i) {
		d['Congress'] = +d['Congress'];
		d['Party'] = PARTIES[d['Party']];
		d['1st Dimension Coordinate'] = Number(d['1st Dimension Coordinate']);
		d['2nd Dimension Coordinate'] = Number(d['2nd Dimension Coordinate']);
		d['slug'] = slugify(d['Party']);
	});
	scores.add(data);
	plotCongress(111);
});
</script>