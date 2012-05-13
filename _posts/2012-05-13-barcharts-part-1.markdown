---
title: Barcharts, Parts 1 & 2
layout: post
published: true
tags: [d3]
scripts:
 - http://d3js.org/d3.v2.min.js
---
<style type="text/css">
.chart { 
    margin-bottom: 21px; 
    font: 10px sans-serif;
}
.chart div {
    background-color: steelblue;
    text-align: right;
    padding: 3px;
    margin: 1px;
    color: white;
}
.chart rect {
    stroke: white;
    fill: steelblue;
}
.chart text {
    fill: white;
}
</style>

In which I attempt the first two [D3] tutorials.

 [D3]: http://d3js.org/ "D3: Data-Driven Documents"

First up, let's make a barchart with `div`s.

<div id="chart1"> </div>

<script src="https://gist.github.com/2689645.js?file=barchart1.js"> </script>

<script type="text/javascript">
var data = [4, 12, 13, 18, 21];
(function() {
    var x = d3.scale.linear()
        .domain([0, d3.max(data)])
        .range([0, '420px']);

    var chart = d3.select('#chart1')
        .attr('class', 'chart');

    chart.selectAll('div')
        .data(data)
      .enter().append('div')
        .style('width', x)
        .text(String);

})();
</script>

Easy enough. Now for `SVG` (using the same data as above).

<div id="chart2"> </div>

<script type="text/javascript">
(function() {
    var x = d3.scale.linear()
        .domain([0, d3.max(data)])
        .range([0, 420]);

    var y = d3.scale.ordinal()
        .domain(data)
        .rangeBands([0, data.length * 20]);

    var chart = d3.select('#chart2')
        .append('svg')
        .attr('class', 'chart')
        .attr('width', 420)
        .attr('height', data.length * 20);

    chart.selectAll('rect')
        .data(data)
      .enter().append('rect')
        .attr('y', y)
        .attr('width', x)
        .attr('height', y.rangeBand());

    chart.selectAll('text')
        .data(data)
      .enter().append('text')
        .attr('x', x)
        .attr('y', function(d) { return y(d) + y.rangeBand() / 2; })
        .attr('dx', -3) // padding-right
        .attr('dy', '.35em') // something like vertical-align: middle
        .attr('text-anchor', 'end') // akin to text-align: right
        .text(String);

})();
</script>