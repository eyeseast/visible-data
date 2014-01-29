---
title: "Inequality in Every County in America"
layout: embed
published: true
comments: false
tags: [d3, leaflet, mapbox]
scripts:
 - /visible-data/components/d3/d3.min.js
 - /visible-data/components/colorbrewer/colorbrewer.js
 - /visible-data/components/underscore/underscore-min.js
 - /visible-data/components/queue-async/queue.min.js
 - /visible-data/components/topojson/topojson.min.js
 - //api.tiles.mapbox.com/mapbox.js/v1.5.1/mapbox.js
 - //api.tiles.mapbox.com/mapbox.js/plugins/leaflet-hash/v0.2.1/leaflet-hash.js

styles:
 - //api.tiles.mapbox.com/mapbox.js/v1.5.1/mapbox.css

excerpt: "A county-by-county map of income inequality in America"
---
<style type="text/css">
html,
body,
#map {
    position: relative;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
}
</style>

<div id="map"></div>

<script type="text/javascript">
var urls = {
    counties: '/visible-data/data/gis/us-10m.json',
    gini: '/visible-data/data/census/acs2012_5yr_B19083_050_in_01000US.csv'
};

var map = L.mapbox.map('map', 'chrisamico.map-xg7z6qm5')
    .setView([38.95941, -93.60352], 5)
    .addControl(L.mapbox.geocoderControl('chrisamico.map-xg7z6qm5'));

L.hash(map);

queue()
    .defer(d3.json, urls.counties)
    .defer(d3.csv, urls.gini)
    .await(render);

function render(err, counties, gini) {
    // unpack topojson
    // add to map
    // style by data
    window.counties = counties = topojson.feature(counties, counties.objects.counties);

    // get extent first
    var extent = d3.extent(gini, function(d) { return +d['Gini Index']; })

    // coerce to numbers and index to an object
    gini = _.map(gini, function(d) { 
        d['Gini Index'] = +d['Gini Index'];
        return [+d.GeoID.slice(7), d];
    });

    window.gini = gini = _.object(gini);
    gini.extent = extent;

    var colors = window.colors = d3.scale.quantize()
        .domain(extent)
        .range(colorbrewer.YlOrBr[5]);

    L.geoJson(counties, {
        style: function(feature) {
            var g = gini[feature.id] || {};
            return {
                weight: 1,
                color: '#eee',
                stroke: false,
                fill: true,
                fillColor: colors(g['Gini Index']),
                fillOpacity: .5
            }
        }
    }).addTo(map);

}

</script>