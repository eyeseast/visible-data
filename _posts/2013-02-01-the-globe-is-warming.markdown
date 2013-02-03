---
title: The Globe is Warming
layout: wide
published: true
tags: [d3]

scripts:
 - http://d3js.org/d3.v3.min.js

---

<style type="text/css">

.label {
    font-weight: normal;
    stroke-width: 1;
    font-size: 14px;
}

.annual {
    stroke: #444;
}

.five-year {
    stroke: #860e0d;
}

.line {
    fill: None;
}

path.annual {
    stroke-width: 1.5;
}

path.five-year {
    stroke-width: 2;
}
</style>

Temperature anomalies: The difference between the average global temperature in a given year (one- or five-year rolling average) and the average global temperature from 1950 to 1980 (the baseline).

<div id="chart"></div>

<table id="temp-data" class="table table-condensed table-striped span12"> </table>

<script type="text/javascript">
var url = "/visible-data/data/global-temps.csv";

var yearFormat = d3.time.format('%Y');

d3.csv(url, function(err, data) {
    window.data = data;

    // everything is a number or null
    data.forEach(function(d, i) {
        for (var k in d) {
            if (d[k] === 'null') { d[k] = null; }
            else { d[k] = +d[k]; }
        }
    });

    x.domain(d3.extent(data, function(d) { return d.Year; }));
    //y.domain(d3.extent(data, function(d) { return d['Annual Mean']; }));

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', translate(margin.left, height / 2))
        .call(xAxis);

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', translate(margin.left, 0))
        .call(yAxis);

    svg.append('path')
        .datum(data)
        .attr('class', 'annual line')
        .attr('d', annual);

    svg.append('path')
        .datum(data)
        .attr('class', 'five-year line')
        .attr('d', fiveYear);

    // add the table
    d3.select('#temp-data')
        .datum(data)
        .call(table);

});

// chart
var margin = {top: 20, right: 20, bottom: 20, left: 20}
  , height = 400
  , width  = parseInt(d3.select('#chart').style('width'));


// scales and axes
var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0])
    .domain([-1, 1]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickFormat(String);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

// lines
var annual = d3.svg.line()
    .y(function(d) { return y(d['Annual Mean']); })
    .x(function(d) { return x(d.Year); });

var fiveYear = d3.svg.line()
    .y(function(d) { return y(d['5-year Mean']); })
    .x(function(d) { return x(d.Year); });

// the actual chart
var svg = d3.select('#chart').append('svg')
    .style('height', height)
    .style('width', width)
  .append('g')
    .attr('transform', translate(margin.left, margin.top));

// labels
svg.append('text')
    .attr('transform', translate(margin.left * 2, margin.top * 2))
    .attr('class', 'label annual')
    .text('Annual average');

svg.append('text')
    .attr('transform', translate(margin.left * 2, margin.top * 3))
    .attr('class', 'label five-year')
    .text('Five-year average');


function translate (x, y) {
    return "translate(" + x + "," + y + ")";
}

function table(selection) {
    var data = selection.datum()
      , fields = d3.keys(data[0]);

    // header
    selection.append('thead').append('tr')
      .selectAll('th')
        .data(fields)
      .enter().append('th')
        .text(String);

    var rows = selection.append('tbody')
      .selectAll('tr')
        .data(data)
      .enter().append('tr');

    rows.selectAll('td')
        .data(function(d) { return d3.values(d); })
      .enter().append('td')
        .text(String);

    return selection;
}

</script>