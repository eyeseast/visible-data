---
title: Nadal vs Federer
layout: post
published: true
comments: false
tags: [d3, underscore]
scripts:
 - http://d3js.org/d3.v2.min.js
 - /visible-data/js/tennis-court.js
 - https://raw.github.com/square/crossfilter/master/crossfilter.min.js
 - http://documentcloud.github.com/underscore/underscore-min.js

---
<style type="text/css">
body { position: relative; }
#court {
	width: 320px;
	float: left;
	margin-right: 1em;
}
#court svg {
	background-color: #1d723d;
}

#court line {
	stroke: #eee;
	stroke-width: 1px;
}

#court line:nth-child(2) {
	stroke-width: 3px;
}

</style>

Have data. Let's chart.

<div id="court"> </div>

<script type="text/javascript">
var court = tennisCourt('#court'),
    shots = crossfilter(),
    points = shots.dimension(function(d) { return d.point; });

d3.csv('/visible-data/data/federer-nadal.csv', function(data) {
	window.data = data;
	_.each(data, function(d, i) {
		d.point = +d.point;
		d.x = +d.x;
		d.y = +d.y;
	});
	/***
	court.selectAll('circle.shot')
	    .data(data)
	  .enter().append('circle')
	    .attr('class', 'shot');
	***/
})
</script>