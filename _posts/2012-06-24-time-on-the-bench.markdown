---
title: Time on the Bench
layout: post
published: true
comments: false
tags: [d3, underscore]
scripts:
 - /visible-data/js/d3.v2.min.js
 - /visible-data/js/underscore-min.js
 - /visible-data/js/jquery-1.7.2.min.js
 - /visible-data/bootstrap/js/bootstrap-button.js
---
<style type="text/css">
#chart rect {
    stroke: white;
    fill: SteelBlue;
    shape-rendering: crispEdges;
}
#chart text {
}
#chart .rule {
    shape-rendering: crispEdges;
    stroke: #ccc;
}
#buttons {
    margin-bottom: 1.5em;
}

</style>

Supreme Court justices serve for life.

<div id="buttons" class="btn-group" data-toggle="buttons-radio">
    <button id="served" class="btn">Time Served</button>
    <button id="age" class="btn">Starting Age</button>
</div>

<div id="chart"> </div>

[John Rutledge](http://en.wikipedia.org/wiki/John_Rutledge) served a three-month term as chief justice after a recess appointment by George Washington, but the Senate rejected his confirmation for a full term. Rather than have a blank line in the chart (since he served less than a year), I've simply removed that row.

<script type="text/javascript">
var pad = 5,
    height = 20,
    width = parseInt(d3.select('#chart').style('width')) - pad,
    url = "/visible-data/data/supremes.csv";

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear();

var chart = d3.select('#chart').append('svg'),
    axis = chart.append('g')
        .classed('axis', true)
        .attr('transform', translate(pad, height)),
    
    bottomAxis = chart.append('g')
        .classed('axis', true);

var xAxis = d3.svg.axis()
    .scale(x);

function translate(x,y) {
    return "translate("+x+","+y+")";
}

function plotAges() {
    // plot ages started and retired or died
    x.domain([
        0,
        _.chain(data).pluck('Ending Age').max().value()
    ]);

    bars.transition()
        .duration(500)
        .attr('x', function(d) { return x(d['Starting Age']); })
        .attr('width', function(d) { return x(d.Served); });

    addText('left');
    axis.transition()
        .duration(500)
        .call(xAxis.orient('top'));

    bottomAxis.transition()
        .duration(500)
        .call(xAxis.orient('bottom'));
}

function plotServed() {
    // plot time served as simple bars
    // set our horizontal scale from zero to max time served
    x.domain([0, _.chain(data).pluck('Served').max().value()]);

    bars.transition()
        .duration(500)
        .attr('x', 0)
        .attr('width', function(d) { return x(d.Served); });

    addText('right');
    axis.transition()
        .duration(500)
        .call(xAxis.orient('top'));

    bottomAxis.transition()
        .duration(500)
        .call(xAxis.orient('bottom'));
}

function addText(orient) {
    orient = orient || "right";
    var labels = chart.selectAll('text.name')
        .data(data);

    labels.enter().append('text')
        .classed('name', true);
    
    // a few things consistent
    labels.text(function(d) { return d.Judge; })
        .attr('y', function(d,i) { return y(i) + height / 2; })
        .attr('dy', '.35em') // something like vertical-align: middle

    if (orient === "right") {
        labels.attr('text-anchor', 'end') // akin to text-align: right
          //.transition()
          //  .duration(1000)
            .attr('x', width)
            .attr('dx', -3) // padding-right
    } else {
        labels.attr('text-anchor', 'start')
          //.transition()
          //  .duration(1000)
            .attr('x', 0)
            .attr('dx', 3) // padding-left
    }
}

jQuery(function($) {
    $('#served').on('click', plotServed);
    $('#age').on('click', plotAges);
});

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

    chart = chart.style('height', (data.length + 2) * height)
        .append('g')
        .attr('transform', translate(pad, height));

    y.domain([0, data.length]).range([0, data.length * height]);

    bottomAxis.attr('transform', translate(pad, (data.length + 1) * height))

    chart.selectAll('line')
        .data(d3.range(data.length + 1))
      .enter().append('line')
        .classed('rule', true)
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y)
        .attr('y2', y);

    window.bars = chart.selectAll('rect')
        .data(data)
      .enter().append('rect')
        .attr('width', 0)
        .attr('height', height)
        .attr('y', function(d, i) { return y(i); });

    // fake a click to get things rolling
    jQuery('#served').trigger('click');
});
</script>