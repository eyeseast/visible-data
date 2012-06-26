---
title: Time on the Bench
layout: post
published: true
comments: false
tags: [d3, underscore]
scripts:
 - /visible-data/js/d3.v2.min.js
 - /visible-data/js/underscore-min.js

---
<style type="text/css">
#chart rect {
    stroke: white;
    fill: SteelBlue;
    shape-rendering: crispEdges;
}
#chart text {
    fill: white;
}
#chart .rule {
    shape-rendering: crispEdges;
    stroke: #ccc;
}

</style>

Supreme Court justices serve for life.

<div id="chart"> </div>

[John Rutledge](http://en.wikipedia.org/wiki/John_Rutledge) served a three-month term as chief justice after a recess appointment by George Washington, but the Senate rejected his confirmation for a full term. Rather than have a blank line in the chart (since he served less than a year), I've simply removed that row.

<script type="text/javascript">
var height = 20,
    width = d3.select('#chart').style('width'),
    url = "/visible-data/data/supremes.csv";

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear();

function plotAges(data) {
    // plot ages started and retired or died
    x.domain([
        0,
        _.chain(data).pluck('Ending Age').max().value()
    ]);

    var bars = chart.selectAll('rect')
        .data(data);

    bars.enter()
        .append('rect');

    bars.attr('height', height)
        .attr('y', function(d,i) { return y(i); })
      .transition()
        .duration(500)
        .attr('x', function(d) { return x(d['Starting Age']); })
        .attr('width', function(d) { return x(d.Served); });
}

function plotServed(data) {
    // plot time served as simple bars
    // set our horizontal scale from zero to max time served
    x.domain([0, _.chain(data).pluck('Served').max().value()]);

    var bars = chart.selectAll('rect')
        .data(data);
    
    bars.enter()
        .append('rect');

    bars.attr('height', height)
        .attr('x', 0)
        .attr('y', function(d, i) { return y(i); })
        .attr('width', 0)
      .transition()
        .duration(500)
        .attr('width', function(d) { return x(d.Served); });

}

var chart = d3.select('#chart').append('svg');


d3.csv(url, function(data) {
    window.data = data;
    _.each(data, function(d, i) {
        d.Born = +d.Born;
        d.Appointed = +d.Appointed;

        if (d.Terminated.match(/Present/i)) {
            d.Terminated = 2012;
        } else {
            d.Terminated = +d.Terminated;
        }

        d.Died ? d.Died = +d.Died : d.Died = null;

        d.Served = d.Terminated - d.Appointed;
        d['Starting Age'] = d.Appointed - d.Born;
        d['Ending Age'] = d.Terminated - d.Born;
    });

    chart.style('height', (data.length + 1) * height);
    y.domain([0, data.length]).range([0, data.length * height]);

    plotServed(data);
    chart.selectAll('line')
        .data(d3.range(data.length + 1))
      .enter().append('line')
        .classed('rule', true)
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y)
        .attr('y2', y);
});
</script>