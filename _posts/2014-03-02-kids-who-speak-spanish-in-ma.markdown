---
title: "Kids who speak Spanish in MA"
layout: wide
published: false
comments: false
tags: []
comments: false
tags: [d3, leaflet, mapbox]
scripts:
 - /visible-data/components/d3/d3.min.js
 - /visible-data/components/colorbrewer/colorbrewer.js
 - /visible-data/components/underscore/underscore-min.js
 - /visible-data/components/queue-async/queue.min.js
 - /visible-data/components/topojson/topojson.min.js
 - //api.tiles.mapbox.com/mapbox.js/v1.5.1/mapbox.js

styles:
 - //api.tiles.mapbox.com/mapbox.js/v1.5.1/mapbox.css

excerpt: "tl;dr"
---
<style>
    .map {
        width: 100%;
        height: 400px;
    }
</style>

<div id="leaflet-map" class="map"></div>

<div id="d3-map" class="map"></div>

<script>
var table = "acs2012_5yr_B16007_04000US25"
  , data = "/visible-data/data/census/" + table + "/" + table + ".geojson"
  , property = "Speak Spanish";

d3.json(data, function(kids) {
    //var kids = window.kids = topojson.feature(resp, resp.objects[table]);

    var extent = window.extent = d3.extent(kids.features, function(d) { return d.properties[property]; });
    
    var colors = window.colors = window.colors = d3.scale.quantize()
        .domain(extent)
        .range(colorbrewer.YlGn[5]);

    leafmap(kids, colors);
    vectormap(kids, colors);
});

// leaflet
function leafmap(kids) {

    var map = L.mapbox.map('leaflet-map', 'chrisamico.map-xg7z6qm5')
        .setView([42.206, -71.282], 8);

    L.geoJson(kids, {
        style: function(feature) {
            var g = feature.properties[property];
            return {
                weight: 1,
                color: '#eee',
                stroke: false,
                fill: true,
                fillColor: colors(g),
                fillOpacity: .5,
                clickable: false
            }
        }
    }).addTo(map);

};

// d3
function vectormap(features) {

};
</script>