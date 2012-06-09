---
title: Bad Air in Beijing
layout: post
published: true
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
    width = 620,
    pad = 20,
    url = "/visible-data/data/beijingair.csv";

var colors = d3.scale.linear()
    .domain(['green', 'yellow', 'orange', 'red', 'purple', 'maroon'])
    .range([0, 51, 101, 151, 201, 301]);

var format = d3.time.format('%m-%d-%Y %H:%M');

var x = d3.scale.linear()
    .range([0, width]);

var chart = d3.select('#chart').append('svg')
    .style('height', height + pad);

d3.csv(url, function(data) {
    window.data = data;
    _.each(data, function(d, i) {
        d.aqi = +d.aqi;
        d.pm25 = +d.pm25;
        d.date = new Date(Date.parse(d.date));
    });

});

</script>