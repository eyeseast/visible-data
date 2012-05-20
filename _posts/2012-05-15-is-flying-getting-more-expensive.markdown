---
title: Is flying getting more expensive?
layout: post
published: true
tags: [d3, underscore]
scripts:
 - http://d3js.org/d3.v2.min.js
 - http://documentcloud.github.com/underscore/underscore-min.js
---
<style type="text/css">
svg {
    font-size: 10px;
    font-family: sans-serif;
}

path.line {
    fill: none;
    stroke: #c40;
    stroke-width: 3px;
}

g.tick line {
    stroke: #ddd;
    stroke-width: .5;
}

line.axis {
    stroke: #444;
}

g.axis path, g.axis line {
    stroke: #444;
    stroke-width: .5;
    fill: none;
}
</style>

Since I'm looking for flights to California and not finding anything south of $400, let's look at [the data](http://www.bts.gov/xml/atpi/src/datadisp_tableseries.xml) (with thanks to [@mtahani](https://twitter.com/#!/mtahani/statuses/202468422787940352)). This chart shows the quarterly average price of a plane ticket in the United States since 1995.

<div id="chart"> </div>

The data for this chart is below. A couple thoughts on making a simple line chart with D3:

I followed [this blog post](http://dealloc.me/2011/06/24/d3-is-not-a-graphing-library.html), with a few deviations. I started off drawing axes by hand, but in the end I used [d3.svg.axis](https://github.com/mbostock/d3/wiki/SVG-Axes). I spent far more time than I expected making minor adjustments to color and stroke width and position.

Drawing a simple line chart really drove home the title of that blog post I just linked: D3 is not a charting library. It can be used to build charts, but for this dataset, I could have gotten to a workable solution faster (and with cross-browser support) using something like [HighCharts](http://www.highcharts.com/).

That said, I'm also starting to see how D3 can be really powerful. It's a tool for describing how data should fit together. There's a certain way of thinking built into it, and understanding that is key to doing anything useful. I'm not sure how to describe that thinking just yet, but the patterns make more sense than they did a week ago.

<table id="data" class="table table-condensed table-striped">
	<thead>Average US Airfare, 1995 - 2011</thead>
	<tbody></tbody>
</table>

<script type="text/javascript">
var url = "/visible-data/data/AirFares.csv";
d3.csv(url, function(data) {
    window.data = data;
    var fares = _.map(data, function(d, i) {
        return Number(d['Fare']);
    });

    var quarters = _.map(data, function(d, i) {
        // for labels; Quarter already has a space prepended
        return d['Year'] + d['Quarter']
    });

    // chart
    var padding = 35,
        height = 250,
        width = 620 - padding;

    var x = d3.scale.linear()
        .domain([0, data.length - 1])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([_.min(fares) - 25, _.max(fares)])
        .range([height - 20, 0]);

    window.x = x, window.y = y;
    window.chart = d3.select('#chart').append('svg')
        .style('height', height)
        .append('g')
        .attr('transform', 'translate(' + padding + ',0)');

    window.xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .tickFormat(function(d, i) { return quarters[d]; });

    chart.append('g')
        .attr('transform', 'translate(0,' + (height - 20) + ')')
        .attr('class', 'x axis')
        .call(xAxis);

    window.yAxis = d3.svg.axis()
        .scale(y)
        .ticks(7)
        .orient('left')
        .tickFormat(function(d) { return '$' + d; });

    chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    var line = d3.svg.line()
        .x(function(d, i) { return x(i); })
        .y(function(d) { return y(d['Fare']); })
        .interpolate('linear');

    chart.selectAll('path.line')
        .data([data])
      .enter().append('path')
        .attr('class', 'line')
        .attr('d', line)
        .attr('transform', 'translate(0,0)');

    // table
    var table = d3.select('#data');

    table.select('thead').selectAll('th')
        .data(_.keys(data[0]))
      .enter().append('th')
        .text(String);

    table.select('tbody').selectAll('tr')
        .data(data)
      .enter().append('tr')
        .selectAll('td')
        .data(function(d) { return _.values(d); })
      .enter().append('td')
        .text(function(d, i) {
        	if (i === 2) { return '$' + d; }
        	return d;
        });
});
</script>