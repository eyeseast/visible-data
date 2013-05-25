---
title: State of the Drought
layout: wide
published: true
tags: [d3, topojson]
scripts:
 - /visible-data/components/d3/d3.min.js
 - http://d3js.org/topojson.v1.js
---
<style type="text/css">
#map {
    width: 100%;
    height: 600px;
}

</style>
<div id="map"></div>

<script type="text/javascript">
var urls = {
    drought: "/visible-data/data/gis/drought/drought.json",
    us: "/visible-data/data/gis/us.json"
};

var margin = {top: 10, right: 10, bottom: 10, left: 10}
  , width = parseInt(d3.select('#map').style('width'))
  , width = width - margin.right - margin.left
  , height = parseInt(d3.select('#map').style('height'))
  , height = height - margin.top - margin.bottom;

var map = d3.select('#map').append('svg')
    .style('width', width)
    .style('height', height);

var albers = d3.geo.albersUsa();

var path = d3.geo.path()
    .projection(albers);

d3.json(urls.drought, function(err, data) {
    var drought = topojson.feature(data, data.objects.usdm130521);

    map.selectAll('path')
        .data(drought.features)
      .enter().append('path')
        .attr('d', path);
});

</script>