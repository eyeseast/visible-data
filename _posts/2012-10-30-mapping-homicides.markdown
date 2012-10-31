---
title: Mapping Homicides
layout: post
published: true
tags: [leaflet, mapbox]
scripts:
 - /visible-data/js/leaflet/leaflet.js
 - /visible-data/js/markercluster/leaflet.markercluster.js
 - /visible-data/js/wax/dist/wax.leaf.min.js
 - /visible-data/js/jquery-1.7.2.min.js
 - /visible-data/js/underscore-min.js

styles:
 - /visible-data/js/leaflet/leaflet.css
 - /visible-data/js/markercluster/MarkerCluster.css
 - /visible-data/js/markercluster/MarkerCluster.Default.css

styles_ie:
  - /visible-data/js/leaflet/leaflet.ie.css
  - /visible-data/js/markercluster/MarkerCluster.Default.ie.css
---
<style type="text/css">
#homicide-map {
    width: 960px;
    height: 500px;
}
</style>

<div id="homicide-map"></div>

<script type="text/javascript">
var map = L.map('homicide-map')
  , url = "http://a.tiles.mapbox.com/v3/chrisamico.map-xg7z6qm5.jsonp";

wax.tilejson(url, function(tilejson) {
    // globalize this for debugging
    window.tilejson = tilejson;
    
    // shorten this
    var c = tilejson.center;

    // the map then
    map.addLayer(new wax.leaf.connector(tilejson))
        .setView([c[1], c[0]], c[2]);

});

jQuery.ajax({
    url: 'http://homicidewatch.org/api/v1/homicides/?since=2012-01-01',
    dataType: 'jsonp',
    success: function(data, status, xhr) {
        var markers = map.markers = new L.MarkerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: 40,
            singleMarkerMode: true
        });
        map.addLayer(markers);

        _.each(data.objects, function(h, i) {
            var c = h.point.coordinates;
            markers.addLayer(L.marker([c[1], c[0]]));
        })
    }
});
</script>