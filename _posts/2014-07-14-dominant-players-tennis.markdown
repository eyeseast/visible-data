---
title: "Dominant Players, tennis edition"
layout: wide
published: true
comments: false
tags: []
scripts: 
 - /visible-data/components/d3/d3.min.js
 - /visible-data/components/underscore/underscore-min.js
 - /visible-data/components/moment/min/moment.min.js

styles: []
excerpt: "tl;dr"
---
<style>
    .chart {
        width: 100%;
        height: 400px;
        border: 2px solid #333;
        margin-bottom: 2em;
        position: relative;
    }

    .chart h3 {
        position: absolute;
        left: 1em;
    }

    path.player {
        stroke: #777;
        stroke-width: 2px;
        fill: none;
    }

    #pane {
        cursor: move;
        fill: none;
        pointer-events: all;
    }

</style>

<div id="women" class="chart">
    <h3>Women's Singles</h3>
</div>

<div id="men" class="chart">
    <h3>Men's Singles</h3>
</div>

<script>
var margin = {top: 10, right: 10, bottom: 10, left: 10}
  , width = parseInt(d3.select('#women').style('width'), 10)
  , width = width - margin.left - margin.right
  , height = parseInt(d3.select('#women').style('height'), 10)
  , height = height - margin.top - margin.bottom;

var urls = {
    women: '/visible-data/data/tennis/women.csv', 
    men: '/visible-data/data/tennis/men.csv'
};

var format = {
    date: d3.time.format('%Y-%m-%d')
};

// global stash
var data = {};

_.each(urls, function(url, label) {
    d3.csv(url).row(function(d) {
        d.date = format.date.parse(d.date);
        d.rank = +d.rank;
        return d;
    }).get(function(err, rows) { return render(label, rows); });
});

function render(label, rows) {
    // render a chart
    var svg = d3.select('#' + label).append('svg')
      .style('width', (width + margin.left + margin.right) + 'px')
      .style('height', (height + margin.top + margin.bottom) + 'px')
    .append('g')
      .attr('transform', 'translate(' + [margin.left, margin.top] + ')');

    // date extent
    var dates = _(rows).chain().pluck('date').unique().sort(d3.ascending).value()
      , end = _.last(dates)
      , start = moment(end).subtract('years', 5).toDate()
      , extent = [start, end];
    //var dates = d3.extent(rows, function(d) { return d.date; });

    // scales: x is time, y is rank (1 is high)
    var x = d3.time.scale()
        .domain(extent)
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([1, 100])
        .range([0, height]);

    // zoom
    var zoom = d3.behavior.zoom()
        .x(x)
        //.scale(5)
        .scaleExtent([1, 10])
        .on('zoom', onzoom);

    svg.append('rect')
        .attr('id', 'pane')
        .attr('width', width)
        .attr('height', height)
        .call(zoom);

    // axes
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('top');

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + [0, height] + ')')
        .call(xAxis);

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + [width, 0] + ')')
        .call(yAxis);

    // draw our actual lines
    var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.rank); })
        .interpolate('basis');

    var players = d3.nest()
        .key(function(d) { return d.player; })
        .sortValues(function(a, b) { return d3.ascending(a.date, b.date); })
        .entries(rows);

    var lines = svg.append('g')
        .attr('class', 'players')
      .selectAll('path.player')
        .data(players);
    
    lines.enter().append('path')
        .attr('class', 'player')
        .attr('data-player', function(d) { return d.key; })
        .attr('d', function(d) { return line(d.values); });

    function onzoom(e) {
        svg.select('.x.axis').call(xAxis);
        lines.attr('d', function(d) { return line(d.values); });
    }

    // export for debugging
    data[label] = {
        dates: dates,
        extent: extent,
        x: x,
        y: y,
        players: players,
        line: line,
        zoom: zoom
    };
}

/***
Split a list into groups based on breaks in sequence.
Takes a list and compare function.

The compare function takes the item, its index and the list, and returns
true if the item should go in the current group, or false if it should be
in a new group. This assumes the list is sorted and sequential.

Always returns a list of lists, even if there is only one group.

Example:

    var list = [1, 2, 3, 5, 6, 7];
    var grouped = breaks(list, function(d, i, list) {
        return i == 0 ? true : d - list[i - 1] == 1;
    });
    console.log(grouped);
    // [[1, 2, 3], [5, 6, 7]]
***/
function breaks(array, compare) {
    var groups = [[]], current = 0;

    // loop through the list
    _.each(array, function(d, i, list) {
        // run the compare function for truthiness
        if (compare(d, i, list)) {
            // return true for the current group
            groups[current].push(d);
        } else {
            // return false for a new group
            groups.push([]);
            current++;
            groups[current].push(d);
        }
    });

    return groups;
}

</script>