---
title: Barcharts, Parts 1 & 2
layout: post
published: true
tags: [d3]
scripts:
 - http://d3js.org/d3.v2.min.js
---
<style type="text/css">
.chart { margin-bottom: 21px; }
.chart div {
    font: 10px sans-serif;
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

    var chart = d3.select('#chart2')
        .append('svg')
        .attr('class', 'chart')
        .attr('width', 420)
        .attr('height', data.length * 20);

    chart.selectAll('rect')
        .data(data)
      .enter().append('rect')
        .attr('y', function(d, i) { return i * 20; })
        .attr('width', x)
        .attr('height', 20);
})();
</script>