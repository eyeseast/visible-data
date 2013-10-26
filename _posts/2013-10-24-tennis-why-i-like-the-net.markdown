---
title: "Tennis: Why I like the net."
layout: post
published: true
comments: false
tags: [d3, tennis]
scripts: 
 - /visible-data/components/d3/d3.min.js

styles: []
excerpt: "tl;dr"
---
<style type="text/css">
body { position: relative; }
#court {
	width: 50%;
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

<div id="court"></div>

<script type="text/javascript">

var tc = tenniscourt()
  , court = d3.select('#court').call(tc);

d3.select(window).on('resize', function() { court.call(tc); });

function tenniscourt() {
	// returns a function that will render a tennis court
	// to each item in a selection.
	//
	// Usage: d3.select('#court').call(tenniscourt())

	var margin = {top: 10, right: 10, bottom: 10, left: 10}
	  , cw = 36 // standard court dimensions, in feet
	  , ch = 78;

	function tc(selection) {
		// render a court to each element in this selection
		selection.each(function(d, i) {
			var el = d3.select(this)
			  , width = parseInt(el.style('width'), 10)
			  , width = width - margin.left - margin.right
			  , height = width * (ch / cw);

			// scales
			var x = d3.scale.linear()
			    .domain([0, cw]) // width of a court
			    .range([0, width]);

			var y = d3.scale.linear()
			    .domain([0, ch])
			    .range([0, height]);

			// ensure one svg element
			el.selectAll('svg')
			    .data([0])
			  .enter().append('svg')
		      .append('g')
		        .attr('transform', 'translate(' + [margin.left, margin.top] + ')');

		    // set dimensions in the update
		    el.select('svg')
			    .style('width', (width + margin.left + margin.right) + 'px')
			    .style('height', (height + margin.top + margin.bottom) + 'px')

			// now grab the g element
		    var court = el.select('svg g');

		    // baselines
		    var baselines = court.selectAll('line.baseline')
		        .data([0, ch / 2, ch]);
		    
		    baselines.enter().append('line')
		        .attr('class', 'baseline');

		    baselines.attr('x1', 0)
		        .attr('x2', x(cw))
		        .attr('y1', y)
		        .attr('y2', y);

		    // sidelines
		    var sidelines = court.selectAll('line.sideline')
		        .data([0, 4.5, cw - 4.5, cw]);
		    
		    sidelines.enter().append('line')
		        .attr('class', 'sideline');
		    
		    sidelines.attr('x1', x)
		        .attr('x2', x)
		        .attr('y1', 0)
		        .attr('y2', y(ch));

		    // service boxes
		    //var service = [ch / 2 + 21, ch / 2 - 21];
		    var service = court.selectAll('line.service')
		        .data([ch / 2 + 21, ch / 2 - 21]);
		    
		    service.enter().append('line')
		        .attr('class', 'service');

		    service.attr('x1', x(4.5)) // start at the alley
		        .attr('x2', x(cw - 4.5)) // end at the opposite alley
		        .attr('y1', y)
		        .attr('y2', y);

		    var center = court.selectAll('line.center')
		        .data(service.data());
		    
		    center.enter().append('line')
		        .attr('class', 'center');

		    center.attr('x1', x(cw / 2))
		        .attr('x2', x(cw / 2))
		        .attr('y1', y)
		        .attr('y2', y(ch / 2));

		    // center marks
		    var marks = court.selectAll('line.mark')
		        .data([0, ch - 1]);
		    
		    marks.enter().append('line')
		        .attr('class', 'mark');

		    marks.attr('x1', x(cw / 2))
		        .attr('x2', x(cw / 2))
		        .attr('y1', y)
		        .attr('y2', function(d) { return y(d) + y(1); });
		});
	}

	tc.margin = function(m) {
		if (arguments.length > 0) {
			margin = m;
			return tc;
		} else {
			return margin;
		}
	}

	tc.dimensions = function() {
		// return court dimensions, for utility
		return {
			width: cw,
			height: ch
		}
	}

	return tc;
}
</script>