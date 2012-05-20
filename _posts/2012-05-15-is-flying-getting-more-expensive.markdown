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

Since I'm looking for flights to California and not finding anything south of $400, let's look at [the data](http://www.bts.gov/xml/atpi/src/datadisp_tableseries.xml).

<div id="chart"> </div>

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