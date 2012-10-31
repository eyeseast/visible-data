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
.map {
    width: 960px;
    height: 500px;
    margin-bottom: 2em;
}
</style>

<div id="maps" class="clearfix"></div>

Which do we like best here?

<script type="text/javascript">
var ids = [
    "chrisamico.map-xg7z6qm5",
    "mapbox.mapbox-light",
    "mapbox.mapbox-light,mapbox.dc-bright",
    "examples.map-4l7djmvo",
    "mapbox.mapbox-streets"
];

var maps = {}
    root = $('#maps');

_.each(ids, function(id, i) {
    // stash our map
    maps[id] = {};
    
    // save useful things
    var url = maps[id].url = "http://a.tiles.mapbox.com/v3/" + id + ".jsonp",
        el  = maps[id].el  = $('<div/>').addClass('map')
            .attr('id', id)
            .appendTo(root);

    var map = maps[id].map = L.map(el[0]);
    wax.tilejson(url, function(tilejson) {
        // globalize this for debugging
        maps[id].tilejson = tilejson;
        
        // shorten this
        var c = [
            -77.03269227586101,
            38.89800364300846,
            12
        ];

        // the map then
        map.addLayer(new wax.leaf.connector(tilejson))
            .setView([c[1], c[0]], c[2]);

    });
});

$.ajax({
    url: 'http://homicidewatch.org/api/v1/homicides/?since=2012-01-01',
    dataType: 'jsonp',
    success: function(data, status, xhr) {
        _.each(ids, function(id, i) {
            var map = maps[id].map;
            var markers = map.markers = new L.MarkerClusterGroup({
                showCoverageOnHover: false,
                maxClusterRadius: 40,
                singleMarkerMode: true
            }).addTo(map);

            _.each(data.objects, function(h, i) {
                var c = h.point.coordinates;
                markers.addLayer(L.marker([c[1], c[0]]));
            });
        });
    }
});

</script>