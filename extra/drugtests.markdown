---
title: Drug Tests
layout: wide
published: true

scripts:
 - /visible-data/components/d3/d3.v2.min.js
 - /visible-data/components/underscore/underscore-min.js

---

A scatterplot:

<div id="chart"> </div>

<script type="text/javascript">

function translate(x, y) {
    return "translate("+x+","+y+")"; 
}

var url = "/visible-data/data/drugtests.csv";

var margin = {top: 20, right: 20, bottom: 20, left: 20}
  , height = 600
  , width = 960 - margin.right - margin.left
  , format = d3.time.format('%Y-%m-%d')
  , chemists;

var chart = d3.select('#chart').append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
  .append('g')
    .attr('transform', translate(margin.left, 0));

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
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

d3.csv(url, function(data) {
    window.data = data;
    chemists = {};

    _.each(data, function(d) {
        d.date_in = format.parse(d.date_in);
        d.date_analyzed = format.parse(d.date_analyzed);
        d.time_to_test = d.date_analyzed - d.date_in;
    });
});

</script>