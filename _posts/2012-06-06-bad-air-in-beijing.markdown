---
title: Bad Air in Beijing
layout: post
published: false
tags: [d3, python]
scripts:
 - /visible-data/js/d3.v2.min.js
 - /visible-data/js/underscore-min.js

---
<style type="text/css">
.aqi-green { background-color: green; color: #ddd; }
.aqi-green:hover { color: #333; }
.aqi-yellow { background-color: yellow; }
.aqi-orange { background-color: orange; }
.aqi-purple { background-color: purple; color: #ddd; }
.aqi-purple:hover { color: #333; }
.aqi-maroon { background-color: maroon; color: #ddd; }
.aqi-maroon:hover { color: #333; }
.aqi-red { background-color: red; color: #ddd; }
.aqi-red:hover { color: #333; }

#chart rect {
  stroke-width: 0.1;
}

#chart path {
  fill: #ddd;
}
</style>

How bad is the air in Beijing? I remember being there in February 2007, freezing, and being unable to see across Tiananmen Square. Things got marginally better in the run up to the 2008 Olympic Games, but the city can only do so much.

<div id="chart"> </div>

<table class="table">
    <tbody>
      <tr>
      </tr><tr>
        <th>Air Quality Index<br>
          (AQI) Values</th>
        <th>Levels of Health Concern</th>
        <th>Colors</th>
      </tr>
      <tr class="aqi-green">
        <td>0-50 </td>
        <td> Good</td>
        <td>Green</td>
      </tr>
      <tr class="aqi-yellow">
        <td>51-100 </td>
        <td>Moderate</td>
        <td>Yellow</td>
      </tr>
      <tr class="aqi-orange">
        <td>101-150 </td>
        <td>Unhealthy for Sensitive Groups </td>
        <td>Orange</td>
      </tr>
      <tr class="aqi-red">
        <td>151 to 200</td>
        <td>Unhealthy </td>
        <td>Red</td>
      </tr>
      <tr class="aqi-purple">
        <td>201 to 300</td>
        <td> Very Unhealthy</td>
        <td> Purple</td>
      </tr>
      <tr class="aqi-maroon">
        <td>301 to 500</td>
        <td>Hazardous</td>
        <td>Maroon</td>
      </tr>
    </tbody>
  </table>

Source:

<script type="text/javascript">
// mise en place
var height = 200,
    width = 1000,
    pad = 20,
    url = "/visible-data/data/beijingair.csv";

var colors = d3.scale.linear()
    .range(['green', 'yellow', 'orange', 'red', 'purple', 'maroon'])
    .domain([0, 51, 101, 151, 201, 301]);

var format = d3.time.format('%m-%d-%Y %H:%M');

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0])
    .domain([0, 525]); // max aqi

var chart = d3.select('#chart').append('svg')
    .style('height', height + pad)
    .style('width', width);

var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1( function(d) { return height - y(d.aqi); });

function plot(data) {
    
}


d3.csv(url, function(data) {
    window.data = data;
    _.each(data, function(d, i) {
        d.aqi = +d.aqi;
        d.pm25 = +d.pm25;
        d.date = new Date(Date.parse(d.date));
    });

    // set our date range
    x.domain(d3.extent(_.pluck(data, 'date')));


    /***
    chart.selectAll('path')
        .data([data])
      .enter().append('path')
        .attr('d', area);
    ***/
    chart.selectAll('rect')
        .data(data)
      .enter().append('rect')
        .attr('x', function(d,i) { return x(d.date); })
        .attr('y', function(d) { return height - y(d.aqi); })
        .attr('height', function(d) { return y(d.aqi); })
        .attr('width', width / data.length)
        .style('stroke', function(d) { colors(d.aqi); })
        .style('fill', function(d) { colors(d.aqi); });

    /***
    chart.selectAll('line.bar')
        .data(data)
      .enter().append('line')
        .attr('class', 'bar')
        .attr('x1', function(d) { return x(d.date); })
        .attr('x2', function(d) { return x(d.date); })
        .attr('y1', height)
        .attr('y2', function(d) { return y(d.aqi); })
        .style('stroke-width', width / data.length)
        .style('stroke', function(d) { return colors(d.aqi); });
    ***/
});


</script>