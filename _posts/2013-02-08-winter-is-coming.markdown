---
title: Winter is Coming
layout: embed
published: false
tags: [leaflet, ogr2ogr, topojson]

scripts:
 - /visible-data/components/underscore/underscore-min.js
 - http://cdn.leafletjs.com/leaflet-0.5.1/leaflet.js
 - http://d3js.org/d3.v3.min.js
 - http://d3js.org/topojson.v0.min.js

styles:
 - http://cdn.leafletjs.com/leaflet-0.5.1/leaflet.css

styles_ie:
 - http://cdn.leafletjs.com/leaflet-0.5.1/leaflet.ie.css
---
<style type="text/css">
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
}

#map {
    width: 100%;
    height: 100%;
}
</style>


<div id="map"></div>

<script type="text/javascript">
var map = L.map('map')
  , url = "/visible-data/data/weather/forecast.json";

map.addLayer(L.tileLayer('http://{s}.tiles.mapbox.com/v3/chrisamico.map-xg7z6qm5/{z}/{x}/{y}.png'))
    .setView([42.3492, -71.0504], 10);



</script>