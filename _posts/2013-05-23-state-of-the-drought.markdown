---
title: State of the Drought
layout: wide
published: true
tags: [d3, topojson]
scripts:
 - /visible-data/components/d3/d3.min.js
 - http://d3js.org/topojson.v1.js
 - /visible-data/components/queue-async/queue.min.js
---
<style type="text/css">
#map {
    width: 100%;
    height: 550px;
}

.DM-0 { fill: rgb(255, 255, 0); }
.DM-1 { fill: rgb(252, 211, 127); }
.DM-2 {fill: rgb(255, 170, 0); }
.DM-3 {fill: rgb(230, 0, 0); }
.DM-4 {fill: rgb(115, 0, 0); }

.states {
    fill: none;
    stroke: #ddd;
    stroke-width: 1;
}

.land {
    fill: #eee;
}

</style>
<div id="map"></div>

A few years ago, I helped map the [worst single-year drought in Texas history](http://stateimpact.npr.org/texas/drought/), and later the broader [US drought](http://www.npr.org/2012/07/18/156989764/interactive-mapping-the-u-s-drought). So I thought I'd revisit it in D3.

<script type="text/javascript">
var urls = {
    drought: "/visible-data/data/gis/drought/usdm130521/usdm130521.json",
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

queue()
    .defer(d3.json, urls.us)
    .defer(d3.json, urls.drought)
    .await(render);

function render(err, us, drought) {

    window.data = {
        drought: drought,
        us: us
    };

    var drought = topojson.feature(drought, drought.objects['usdm130521-projected'])
      , land = topojson.mesh(us, us.objects.land)
      , states = topojson.feature(us, us.objects.states);

    map.append('path')
        .attr('class', 'land')
        .datum(land)
        .attr('d', path);

    map.selectAll('path.drought')
        .data(drought.features)
      .enter().append('path')
        .attr('d', path)
        .attr('class', function(d) { return "drought DM-" + d.id; });

    map.selectAll('path.states')
        .data(states.features)
      .enter().append('path')
        .attr('d', path)
        .attr('class', 'states');
};

</script>