---
title: Bad Air in Beijing
layout: post
published: true
tags: [d3, python]
scripts:
 - http://d3js.org/d3.v2.js

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

How bad is the air in Beijing? I remember being there in February 2007, freezing, and being unable to see across Tiananmen Square.

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