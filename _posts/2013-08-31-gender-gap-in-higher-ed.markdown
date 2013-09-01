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
html,
body {
    position: relative;
}

.caption {
    display: none;

    background-color: #fff;
    border: 1px solid #333;
    border-radius: 1;
    padding: .5em;
    position: absolute;
}

circle.point {
    stroke: #41ab5d;
    fill: #74c476;
}

path.overlay {
    fill: none;
    pointer-events: all;
    stroke: #333;
    stroke-width: 1px;
}
</style>

In my series of posts on responsive maps, legends and charts using D3, I used a dataset from the U.S. Census on educational attainment (by way of the new [Census Reporter][cr]). That got me curious what states have a gap between men and women in who had a bachelor's degree. ([Data][])

 [cr]: http://beta.censusreporter.org "Census Reporter, beta"
 [data]: http://beta.censusreporter.org/compare/01000US/040/map/?release=acs2011_1yr&table=C15002 "Sex by Educational Attainment for the Population 25 Years and Over"

<div id="chart"></div>

<script type="x-jst" id="caption-template">
<h5><%= Name %></h5>
<p>
    Female: <%= format(female_percent) %><br>
    Male: <%= format(male_percent) %>
</p>
</script>

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

// voronoi for interaction
var voronoi = d3.geom.voronoi()
    .x(function(d) { return x(d.male_percent); })
    .y(function(d) { return y(d.female_percent); })
    .clipExtent([[0, 0], [width, height]]);

var line = d3.svg.line()
    .interpolate('linear-closed');

var caption = d3.select('body').append('div')
    .attr('class', 'caption');

var template = _.template(d3.select('#caption-template').html());

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

    var overlay = chart.append('g').selectAll('path.overlay')
        .data(voronoi(data))
      .enter().append('path')
        .attr('class', 'overlay')
        .attr('d', line)
        .on('mouseover', showCaption)
        .on('mousemove', showCaption)
        .on('mouseout', hideCaption);
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

    // update axes
    chart.select('.x.axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    chart.select('.y.axis').call(yAxis);

    // update voronoi
    voronoi.clipExtent([[0, 0], [width, height]]);

    chart.selectAll('path.overlay')
        .data(voronoi(data))
        .attr('d', line);
}

function showCaption(d, i) {
    var position = d3.mouse(document.body)
      , state = d.point;

    state.format = percent;

    caption
        .html(template(state))
        .style('display', 'block')
        .style('left', position[0] + 'px')
        .style('top', position[1] + 'px');

}

function hideCaption() {
    caption.style('display', 'none');
}

</script>