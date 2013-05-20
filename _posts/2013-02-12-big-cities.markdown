---
title: Big Cities
layout: post
published: false
tags: [d3, topojson]

scripts:
 - http://d3js.org/d3.v3.min.js
 - http://d3js.org/topojson.v0.min.js

---

Cities, at the same scale.

<div id="cities"> </div>

<script type="text/javascript">
var url = "/visible-data/data/gis/cities/cities.json"
  , margin = {top: 0, right: 0, bottom: 0, left: 0};

var projection = d3.geo.albers()
    .scale(50);

var path = d3.geo.path()
    .projection(projection);

var dc = d3.select('#cities').append('svg');

d3.json(url, function(cities) {
    window.cities = cities;

    dc.append('path')
        .datum(topojson.object(cities, cities.objects.DC).geometries)
        .attr('d', path);

});

</script>