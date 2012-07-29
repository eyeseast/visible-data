---
title: Seismic Hazards
layout: post
published: true
tags: [mapbox]
scripts:
 - http://api.tiles.mapbox.com/mapbox.js/v0.6.2/mapbox.js

styles:
 - http://api.tiles.mapbox.com/mapbox.js/v0.6.2/mapbox.css
---
<style type="text/css">
#map {
    width: 960px;
    height: 500px;
}
</style>

<ul id="links" class="nav nav-pills">
    <li><a id="america" href="#">North America</a></li>
    <li><a id="europe" href="#">Europe</a></li>
    <li><a id="asia" href="#">East Asia</a></li>
    <li><a id="india" href="#">Indian Subcontinent</a></li>
</ul>

<div id="map"></div>

<script type="text/javascript">
var map = mapbox.map('map'),
    url = "http://a.tiles.mapbox.com/v3/paldhous.map-u05nf9ac.jsonp";

mapbox.load(url, function(box) {
    map.addLayer(box.layer)
        .zoom(4)
        .center({ lat: 36.8445, lon: 139.79 });

    // interaction
    map.interaction.auto();

    // ui
    var features = ['zoomer', 'zoombox', 'legend', 'attribution'];
    features.forEach(function(feature, i) {
        map.ui[feature].add();
    });
    window.box = box;
});

document.getElementById('america').onclick = function() {
  map.ease.location({ lat: 38, lon: -95 }).zoom(4).optimal();
  return false
}

document.getElementById('europe').onclick = function() {
  map.ease.location({ lat: 50.6, lon: 16 }).zoom(4).optimal();
  return false
}

document.getElementById('asia').onclick = function() {
  map.ease.location({ lat: 36.8445, lon: 139.79 }).zoom(4).optimal();
  return false
}

document.getElementById('india').onclick = function() {
  map.ease.location({ lat: 21, lon: 79 }).zoom(4).optimal();
  return false
}


</script>