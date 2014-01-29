---
title: "Leaflet and D3"
layout: wide
published: false
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
<style type="text/css">
#map {
	height: 400px;
}
</style>

<div id="map"></div>

<script type="text/javascript">
var urls = {
	counties: '/visible-data/data/gis/ma-counties.json'
};

var counties;

var map = L.mapbox.map('map', 'chrisamico.map-xg7z6qm5')
    .setView([42.409, -71.472], 8)
    .addControl(L.mapbox.geocoderControl('chrisamico.map-xg7z6qm5'));

d3.json(urls.counties, function(err, data) {
	// unpack topojson
	// add to map
	window.data = data;
	counties = topojson.feature(data, data.objects.counties);

	L.geoJson(counties).addTo(map);
});
</script>