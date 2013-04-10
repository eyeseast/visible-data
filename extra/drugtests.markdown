---
title: Drug Tests
layout: wide
published: true

scripts:
 - /visible-data/components/d3/d3.min.js
 - /visible-data/components/underscore/underscore-min.js

---

A scatterplot:

<div id="chart"> </div>

<script type="text/javascript">

function translate(x, y) {
    return "translate("+x+","+y+")"; 
}

var url = "/visible-data/data/drugtests.csv";

var margin = {top: 50, right: 30, bottom: 30, left: 50}
  , height = 600
  , width = 960 - margin.right - margin.left
  , format = d3.time.format('%Y-%m-%d')
  , chemists;

var chart = d3.select('#chart').append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
  .append('g')
    .attr('transform', translate(margin.left, 0));

// scales and axes

var chemColors = d3.scale.category20();

var x = d3.time.scale()
    .domain([new Date(2008, 2, 1), new Date(2012, 1, 1)])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, 365]) // one year max
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(3)
    .tickFormat(format)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(7)
    .tickFormat(String)
    .orient('left');

// the chart
chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', translate(0, height))
    .call(xAxis);

/***
chart.append('text')
    .attr('class', 'axis label')
    .attr('transform', translate(0, height))
    .text('Date In');
***/

chart.append('g')
    .attr('class', 'y axis')
    .attr('transform', translate(0, 0))
    .call(yAxis);

/***
chart.append('text')
    .attr('class', 'axis label')
    .attr('transform', translate(0, 0))
    .text('Time to analyze');
***/

d3.csv(url, function(data) {
    window.data = data;
    chemists = {};

    _.each(data, function(d) {
        d.date_in = format.parse(d.date_in);
        d.date_analyzed = format.parse(d.date_analyzed);
        d.time_to_test = (d.date_analyzed - d.date_in) / 1000 / 60 / 60 / 24;
    });

    //x.domain(d3.extent(data, function(d) { return d.date_in; }));
    //y.domain([0, d3.max(data, function(d) { return d.time_to_test; })]);
    //y.domain([0, 365]);

    var circles = chart.selectAll('circle')
        .data(data, function(d) { return d.id; });

    circles.enter().append('circle')
        .attr('r', 2)
        .attr('cx', function(d) { return x(d.date_in); })
        .attr('cy', function(d) { return y(d.time_to_test); })
        .style('stroke', function(d) { return chemColors(d.primary_chemist); });

});

</script>