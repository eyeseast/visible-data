---
title: "Gender Gap in Higher Ed"
layout: post
published: true
comments: false
tags: [d3]
scripts:
 - /visible-data/components/d3/d3.min.js
 - /visible-data/components/underscore/underscore-min.js
 - /visible-data/components/highlightjs/highlight.pack.js
---
<style type="text/css">
circle.point {
    stroke: #41ab5d;
    fill: #74c476;
}
</style>

In my series of posts on responsive maps, legends and charts using D3, I used a dataset from the U.S. Census on educational attainment (by way of the new Census Reporter). That got me curious what states have a gap between men and women in who had a bachelor's degree.

<div id="chart"></div>

<script type="text/javascript">
var url = "/visible-data/data/census/bachelors-degrees-gender.csv"
  , margin = {top: 10, right: 10, bottom: 50, left: 50}
  , width = parseInt(d3.select('#chart').style('width'), 10)
  , width = width - margin.left - margin.right
  , height = width // square for now
  , pad = .025
  , percent = d3.format('%');

// scales and axes
var x = d3.scale.linear()
    .domain([0, .5])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, .5])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickFormat(percent);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickFormat(percent);

// setup the chart
var chart = d3.select('#chart').append('svg')
    .style('width', (width + margin.left + margin.right) + 'px')
    .style('height', (height + margin.top + margin.bottom) + 'px')
  .append('g')
    .attr('transform', 'translate(' + [margin.left, margin.top] + ')');

// get teh data and go
d3.csv(url).row(function(d) {
    // Name,GeoID,Total,Male,Male-BA,Female,Female-BA
    d.Total = +d.Total;
    d.Male = +d.Male;
    d['Male-BA'] = +d['Male-BA'];
    d.Female = +d.Female;
    d['Female-BA'] = +d['Female-BA'];

    // percents
    d.male_percent = d['Male-BA'] / d.Male;
    d.female_percent = d['Female-BA'] / d.Female;
    d.percent = (d['Female-BA'] + d['Male-BA']) / d.Total;

    return d;

}).get(function(err, data) {
    // render the chart
    window.data = data;

    // update domains based on data;
    var min = d3.min(data, function(d) {
        return Math.min(d.male_percent, d.female_percent);
    });

    var max = d3.max(data, function(d) {
        return Math.max(d.male_percent, d.female_percent);
    });

    x.domain([min - pad, max + pad]);
    y.domain([min - pad, max + pad]);

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    var circles = chart.selectAll('cirle.point')
        .data(data)
      .enter().append('circle')
        .attr('class', 'point')
        .attr('r', 3)
        .attr('cx', function(d) { return x(d.male_percent); })
        .attr('cy', function(d) { return y(d.female_percent); });

});

d3.select(window).on('resize', resize);

function resize() {
    // update width and height
    width = parseInt(d3.select('#chart').style('width'), 10);
    width = width - margin.left - margin.right;
    height = width;

    // resize svg
    d3.select(chart.node().parentNode)
        .style('width', (width + margin.left + margin.right) + 'px')
        .style('height', (height + margin.top + margin.bottom) + 'px');

    x.range([0, width]);
    y.range([height, 0]);

    chart.selectAll('circle.point')
        .attr('cx', function(d) { return x(d.male_percent); })
        .attr('cy', function(d) { return y(d.female_percent); });

    chart.select('.x.axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    chart.select('.y.axis').call(yAxis);

}

</script>