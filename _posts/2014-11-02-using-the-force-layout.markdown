---
title: "Using the Force (layout)"
layout: wide
published: false
comments: false
tags: []
scripts: 
 - /visible-data/components/d3/d3.min.js
styles: []
excerpt: "tl;dr"
---

Had to make that joke.

<style>
circle.node {
    fill: Steelblue;
    stroke: #000;
    stroke-width: 1;
}

rect.border {
    fill: #fff;
    stroke: #000;
}
</style>

<div id="chart" class="row">
    <div class="col-md-3"></div>
    <div class="col-md-3"></div>
    <div class="col-md-3"></div>
    <div class="col-md-3"></div>
</div>

<script>
var margin = {top: 10, right: 10, bottom: 10, left: 10}
  , width = parseInt(d3.select('#chart').style('width'), 10)
  , width = width - margin.left - margin.right
  , height = 200 - margin.top - margin.bottom
  , n = 20;

var nodes = d3.range(n).map(function(i) {
    return {index: i};
});

var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .on('tick', tick)
    .start();

var svg = d3.select('#chart').append('svg')
    .style('width', (width + margin.left + margin.right) + 'px')
    .style('height', (height + margin.top + margin.bottom) + 'px')
  .append('g')
    .attr('transform', 'translate(' + [margin.left, margin.top] + ')');

svg.append('rect')
    .attr('class', 'border')
    .attr('width', width)
    .attr('height', height);

var node = svg.selectAll('.node')
    .data(nodes)
  .enter().append('circle')
    .attr('class', 'node')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', 8)
    .call(force.drag);

function tick(e) {

    node.attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });

}
</script>