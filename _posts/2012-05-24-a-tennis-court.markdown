---
title: A Tennis Court
layout: post
published: true
comments: true
tags: [d3]
scripts:
 - http://d3js.org/d3.v2.min.js
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

Just for fun, let's draw a tennis court. Using dimensions from [Wikipedia](http://en.wikipedia.org/wiki/Tennis_court):

<div id="court"> </div>

> Tennis is played on a rectangular flat surface, usually of grass, clay, concrete (hard court) or a synthetic suspended court. The court is 23.78 meters (78 feet) long, 10.97 meters (36 feet) wide. Its width is 8.23 meters (27 feet) for singles matches and 10.97 meters (36 feet) for doubles matches. The service line is 6.40 meters (21 feet) from the net. Additional clear space around the court is needed in order for players to reach overrun balls for a total of 18.3 meters (60 feet) wide and 36.7 meters (120 feet) long. A net is stretched across the full width of the court, parallel with the baselines, dividing it into two equal ends. The net is 1.07 meters (3 feet 6 inches) high at the posts, and 0.914 meters (3 feet) high in the center.

This little exercise really drove home D3's [data joins](http://bost.ocks.org/mike/join/). 

Every line on the court is an SVG `line` element. I started off writing each line individually, but that meant writing a lot of code twice. 

Then I thought about using loops, but JavaScript's loops are cumbersome, and it didn't feel right anyway. Lines on the court are predictable, so I should be able to describe them as data arrays, right?

Yup. Each kind of line became a selection. For example:

    // baselines
    court.selectAll('line.baseline')
        .data([0, ch / 2, ch])
      .enter().append('line')
        .attr('class', 'baseline')
        .attr('x1', 0)
        .attr('x2', x(cw))
        .attr('y1', y)
        .attr('y2', y);

For baselines (plus the net), each element in the data array is the Y position, or the distance from one end of the court (`ch` is court height, `cw` is court width). Each array item is joined to an existing or just-created line. The rest is just description. Rinse and repeat for sidelines, service boxes and center marks.

I used D3's linear scales to convert real distance to pixels, so I could think in feet and let D3 do the math.

At some point, I'd love to find some data on shot placement -- where Roger Federer puts his serve, for example.

<script type="text/javascript">
function translate(x,y) {
	return 'translate(' + x + ',' + y + ')';
}

// canvas dimensions
var cw = 36,
    ch = 78,
    width = 300,
    height = width * (ch / cw),
    pad = 10;

// scales
var x = d3.scale.linear()
    .domain([0, cw]) // width of a court
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, ch])
    .range([0, height]);

var court = d3.select('#court').append('svg')
    .style('width', width + pad * 2)
    .style('height', height + pad * 2)
    .append('g')
    .attr('transform', translate(pad,pad));

// baselines
court.selectAll('line.baseline')
    .data([0, ch / 2, ch])
  .enter().append('line')
    .attr('class', 'baseline')
    .attr('class', 'Baseline')
    .attr('x1', 0)
    .attr('x2', x(cw))
    .attr('y1', y)
    .attr('y2', y);

// sidelines
court.selectAll('line.sideline')
    .data([0, 4.5, cw - 4.5, cw])
  .enter().append('line')
    .attr('class', 'sideline')
    .attr('x1', x)
    .attr('x2', x)
    .attr('y1', 0)
    .attr('y2', y(ch));

// service boxes
var service = [ch / 2 + 21, ch / 2 - 21];
court.selectAll('line.service')
    .data(service)
  .enter().append('line')
    .attr('class', 'service')
    .attr('x1', x(4.5)) // start at the alley
    .attr('x2', x(cw - 4.5)) // end at the opposite alley
    .attr('y1', y)
    .attr('y2', y);

court.selectAll('line.center')
    .data(service)
  .enter().append('line')
    .attr('class', 'center')
    .attr('x1', x(cw / 2))
    .attr('x2', x(cw / 2))
    .attr('y1', y)
    .attr('y2', y(ch / 2));

// center marks
court.selectAll('line.mark')
    .data([0, ch - 1])
  .enter().append('line')
    .attr('class', 'mark')
    .attr('x1', x(cw / 2))
    .attr('x2', x(cw / 2))
    .attr('y1', y)
    .attr('y2', function(d) { return y(d) + y(1); });
</script>