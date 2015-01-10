/***
A minimap shows US states under various conditions. The idea is to use this with small multiples.
Geometry data should be loaded once, allowing lots of maps to be rendered without reloading GIS files.

Requires:
 - D3

Usage:

    d3.json('data/us.json', function(us) {
        var states = topojson.feature(us.objects.states);

        var mapper = minimap(states);

        d3.select('#map')
            .datum(list_of_states)
            .call(mapper);
    })
***/

// create a mapper function to reuse
function minimap(features) {

    var path = d3.geo.path()
      , projection = d3.geo.albersUsa()
      , margin = {top: 10, right: 10, bottom: 10, left: 10}
      , mapRatio = .5
      , eachFeature = function() {}
      // in case a full geojson object is passed in
      , features = features.features ? features.features : features;

    function render(d, i) {
        var el = d3.select(this)
          , width = parseInt(el.style('width'), 10)
          , width = width - margin.left - margin.right
          , height = width * mapRatio;

        // set up path and projection for this container
        projection.scale(width)
            .translate([width / 2, height / 2]);

        path.projection(projection);

        var map = el.append('svg')
            .style('height', height + 'px')
            .style('width', width + 'px');

        var states = map.selectAll('path.state')
            .data(features);
        
        states.enter().append('path')
            .attr('d', path)
            .each(eachFeature);
    }

    function mapper(selection) {
        // render the actual map to a selection, walking through each element
        selection.each(render);
    }

    mapper.feature = function(f) {
        if (arguments.length > 0) {
            eachFeature = f;
            return mapper;
        } else {
            return eachFeature;
        }
    }

    mapper.geojson = function(s) {
        if (arguments.length > 0) {
            features = s.features ? s.features : s;
            return mapper;
        } else {
            return features;
        }
    }

    // return the mapper function
    return mapper;
}