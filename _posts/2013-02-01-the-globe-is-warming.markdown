---
title: The Globe is Warming
layout: wide
published: false
tags: [d3]

scripts:
 - http://d3js.org/d3.v3.min.js
 - /visible-data/components/underscore/underscore-min.js
---

<style type="text/css">

#chart svg {
    height: 400px;
}

.legend {
    font-weight: normal;
    font-size: 14px;
    text-shadow: inherit;
}

.annual {
    stroke: #777;
}

.five-year {
    stroke: #860e0d;
}

.line {
    fill: None;
}

path.annual {
    stroke-width: 1;
}

path.five-year {
    stroke-width: 2;
}

.mousebar {
    stroke: #222;
    stroke-width: 1;
}
</style>

Temperature anomalies: The difference between the average global temperature in a given year (one- or five-year rolling average) and the average global temperature from 1950 to 1980 (the baseline).

<div id="chart"></div>

<table id="temp-data" class="table table-condensed table-striped span12"> </table>

<script type="x-jst" id="caption-template">
Value: <%= value %>
</script>

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
        .attr('transform', translate(0, height / 2))
        .call(xAxis);

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', translate(0, 0))
        .call(yAxis);

    trendlines.append('path')
        .datum(data)
        .attr('class', 'annual line')
        .attr('d', annual);

    trendlines.append('path')
        .datum(data)
        .attr('class', 'five-year line')
        .attr('d', fiveYear);

    // add the table
    d3.select('#temp-data')
        .datum(data)
        .call(table);

});

// chart
var margin = {top: 20, right: 20, bottom: 20, left: 40}
  , height = 400 - margin.top - margin.bottom
  , width  = parseInt(d3.select('#chart').style('width')) - margin.left - margin.right;


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
  .append('g')
    .attr('transform', translate(margin.left, margin.top))
    .style('height', height)
    .style('width', width);

// legend
svg.append('text')
    .attr('transform', translate(margin.left, margin.top * 2))
    .attr('class', 'legend annual')
    .text('Annual average');

svg.append('text')
    .attr('transform', translate(margin.left, margin.top * 3))
    .attr('class', 'legend five-year')
    .text('Five-year average');

// trendlines
var trendlines = svg.append('g')
    .attr('class', 'trendlines');
    //.attr('transform', translate(margin.left, 0));

// events
var template = _.template(d3.select('#caption-template').html());

var caption = d3.select('body').append('div')
    .attr('class', 'caption')
    .style('display', 'none');

// draw a vertical bar where the mouse is
var bar = svg.append('line')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', 0)
    .attr('y2', height)
    .attr('class', 'mousebar');

d3.select('#chart').on('mouseover', showCaption)
    .on('mousemove', showCaption)
    .on('mouseout', function(d, i) {
        bar.style('display', 'None');
    });

function showCaption(d, i) {
    var mouse = window.mouse = d3.mouse(svg.node());

    bar.style('display', 'block')
        .attr('x1', mouse[0])
        .attr('x2', mouse[0]);

    
}

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