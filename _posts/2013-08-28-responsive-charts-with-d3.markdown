---
title: Responsive Charts with D3
layout: post
published: true
comments: false
tags: [d3]
scripts:
 - /visible-data/components/d3/d3.min.js
 - /visible-data/components/colorbrewer/colorbrewer.js
 - /visible-data/components/underscore/underscore-min.js
 - /visible-data/components/queue-async/queue.min.js
 - /visible-data/components/topojson/topojson.min.js
 - /visible-data/components/jquery/jquery.min.js
 - /visible-data/components/bootstrap/js/tooltip.js
 - /visible-data/components/highlightjs/highlight.pack.js

styles:
 - /visible-data/components/highlightjs/styles/default.css

excerpt: "Charts need to work everywhere, too."
---
<style type="text/css">
.bar rect {
    stroke: #fff;
    shape-rendering: crispEdges;
}

.bar rect.background {
    fill: #eee;
}

.bar rect.percent {
    fill: #238b45;
}

.bar:hover rect.percent {
    fill: #74c476;
}

.bar text {
    font-size: 12px;
    text-color: #ccc;
}

</style>

A confession: I'm starting to hate choropleth maps.

When it comes to comes to comparing U.S. states, especially where there's no obvious geographic variable, a map is often (usually) the wrong choice.

So let's make a bar chart, and let's make it responsive:

<div id="chart"></div>

<script type="text/javascript">
var url = "/visible-data/data/census/bachelors-degrees.csv"
  , margin = {top: 30, right: 10, bottom: 30, left: 10}
  , width = parseInt(d3.select('#chart').style('width'), 10)
  , width = width - margin.left - margin.right
  , height = 200 // placeholder
  , barHeight = 20
  , spacing = 3
  , percent = d3.format('%');

// scales and axes
var x = d3.scale.linear()
    .range([0, width])
    .domain([0, .4]); // hard-coding this because I know the data

var y = d3.scale.ordinal();

var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(percent);

// create the chart
var chart = d3.select('#chart').append('svg')
    .style('width', (width + margin.left + margin.right) + 'px')
  .append('g')
    .attr('transform', 'translate(' + [margin.left, margin.top] + ')');

d3.csv(url).row(function(d) {
    d.Total = +d.Total;
    d["Bachelor's degree"] = +d["Bachelor's degree"];
    d.percent = d["Bachelor's degree"] / d.Total;

    return d;
}).get(function(err, data) {
    // sort
    data = _.sortBy(data, 'percent').reverse();

    // set y domain
    y.domain(d3.range(data.length))
        .rangeBands([0, data.length * barHeight]);

    // set height based on data
    height = y.rangeExtent()[1];
    d3.select(chart.node().parentNode)
        .style('height', (height + margin.top + margin.bottom) + 'px')

    // render the chart

    // add top and bottom axes
    chart.append('g')
        .attr('class', 'x axis top')
        .call(xAxis.orient('top'));

    chart.append('g')
        .attr('class', 'x axis bottom')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis.orient('bottom'));

    var bars = chart.selectAll('.bar')
        .data(data)
      .enter().append('g')
        .attr('class', 'bar')
        .attr('transform', function(d, i) { return 'translate(0,'  + y(i) + ')'; });

    bars.append('rect')
        .attr('class', 'background')
        .attr('height', y.rangeBand())
        .attr('width', width);

    bars.append('rect')
        .attr('class', 'percent')
        .attr('height', y.rangeBand())
        .attr('width', function(d) { return x(d.percent); })

    bars.append('text')
        .text(function(d) { return d.Name; })
        .attr('y', y.rangeBand() - 5)
        .attr('x', spacing);
});

// resize
d3.select(window).on('resize', resize); 

function resize() {
    // update width
    width = parseInt(d3.select('#chart').style('width'), 10);
    width = width - margin.left - margin.right;

    // resize the chart
    x.range([0, width]);
    d3.select(chart.node().parentNode)
        .style('height', (y.rangeExtent()[1] + margin.top + margin.bottom) + 'px')
        .style('width', (width + margin.left + margin.right) + 'px');

    chart.selectAll('rect.background')
        .attr('width', width);

    chart.selectAll('rect.percent')
        .attr('width', function(d) { return x(d.percent); });

    // update axes
    chart.select('.x.axis.top').call(xAxis.orient('top'));
    chart.select('.x.axis.bottom').call(xAxis.orient('bottom'));

}

</script>
