---
title: "Tennis: Why I like the net."
layout: post
published: true
comments: false
tags: [d3, tennis]
scripts: 
 - /visible-data/components/d3/d3.min.js

styles: []
excerpt: "tl;dr"
---
<style type="text/css">
body { position: relative; }
#court {
    width: 50%;
    float: left;
    margin-right: 1em;
}
#court svg {
    background-color: #1d723d;
}

#court line {
    stroke: #eee;
    stroke-width: 1px;
}

#court line:nth-child(2) {
    stroke-width: 3px;
}

.triangle,
.player {
    stroke: orange;
    stroke-width: 1;
    fill: orange;
    fill-opacity: .5;
}

.player:hover,
.point:hover {
    cursor: move;
}

</style>

<div id="court"></div>

<script type="text/javascript">

var tc = tenniscourt().margin({top: 30, right: 30, bottom: 30, left: 30})
  , court = d3.select('#court').call(tc);

var c = tc.dimensions()
  , x = court.property('x')
  , y = court.property('y');

var triangle = [
    [c.width / 2, c.height], // player
    [c.alley, 0],            // left
    [c.width - c.alley, 0]   // right
];

var line = d3.svg.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });

var drag = d3.behavior.drag().on('drag', function() {
    var circle = d3.select(this)
      , pos = [x.invert(d3.event.x), y.invert(d3.event.y)];

    if (circle.classed('player')) {
        // move player circle and update data
        // limiting movement to one side of the court
        var cy = Math.max(c.height / 2 + 2, pos[1]);
        circle
            .datum([pos[0], cy])
            .attr('cx', d3.event.x)
            .attr('cy', y(cy));
    } else {
        // for points, just update y, freeze x
        // this keeps each point on a sideline
        // points need to stay within the court
        var cy = Math.min(Math.max(0, pos[1]), c.height / 2 - 2);
        circle
            .datum(function(d) {
                return [d[0], cy];
            })
            .attr('cy', y(cy));
    }

    // pull data out of the circles
    // and update the triangle path
    path.datum(court.selectAll('circle').data())
        .attr('d', line);
});

var path = court.select('svg g').append('path')
    .datum(triangle)
    .attr('class', 'triangle')
    .attr('d', line);

var points = court.select('svg g').selectAll('circle.point')
    .data(triangle.slice(1,3)); // just left and right

points.enter().append('circle')
    .attr('class', 'point');

points.attr('r', 5)
    .attr('cx', function(d) { return x(d[0]); })
    .attr('cy', function(d) { return y(d[1]); })
    .call(drag);

var player = court.select('svg g').append('circle')
    .datum(triangle[0])
    .attr('class', 'player')
    .attr('r', 10)
    .attr('cx', function(d) { return x(d[0]); })
    .attr('cy', function(d) { return y(d[1]); })
    .call(drag);

d3.select(window).on('resize', function() { court.call(tc); });

function tenniscourt() {
    /***
    Returns a function that will render a tennis court
    to each item in a selection.
    
    Usage: 
        d3.select('#court').call(tenniscourt())
    ***/

    var margin = {top: 10, right: 10, bottom: 10, left: 10}
      , cw = 36 // standard court dimensions, in feet
      , ch = 78
      , alley = 4.5;

    function tc(selection) {
        // render a court to each element in this selection
        selection.each(function(d, i) {
            var el = d3.select(this)
              , width = parseInt(el.style('width'), 10)
              , width = width - margin.left - margin.right
              , height = width * (ch / cw);

            // scales
            var x = d3.scale.linear()
                .domain([0, cw]) // width of a court
                .range([0, width]);

            var y = d3.scale.linear()
                .domain([0, ch])
                .range([0, height]);

            // stash the scales on the element
            this.x = x;
            this.y = y;

            // ensure one svg element
            el.selectAll('svg')
                .data([0])
              .enter().append('svg')
              .append('g')
                .attr('transform', 'translate(' + [margin.left, margin.top] + ')');

            // set dimensions in the update
            el.select('svg')
                .style('width', (width + margin.left + margin.right) + 'px')
                .style('height', (height + margin.top + margin.bottom) + 'px')

            // now grab the g element
            var court = el.select('svg g');

            // baselines
            var baselines = court.selectAll('line.baseline')
                .data([0, ch / 2, ch]);
            
            baselines.enter().append('line')
                .attr('class', 'baseline');

            baselines.attr('x1', 0)
                .attr('x2', x(cw))
                .attr('y1', y)
                .attr('y2', y);

            // sidelines
            var sidelines = court.selectAll('line.sideline')
                .data([0, alley, cw - alley, cw]);
            
            sidelines.enter().append('line')
                .attr('class', 'sideline');
            
            sidelines.attr('x1', x)
                .attr('x2', x)
                .attr('y1', 0)
                .attr('y2', y(ch));

            // service boxes
            //var service = [ch / 2 + 21, ch / 2 - 21];
            var service = court.selectAll('line.service')
                .data([ch / 2 + 21, ch / 2 - 21]);
            
            service.enter().append('line')
                .attr('class', 'service');

            service.attr('x1', x(alley)) // start at the alley
                .attr('x2', x(cw - alley)) // end at the opposite alley
                .attr('y1', y)
                .attr('y2', y);

            var center = court.selectAll('line.center')
                .data(service.data());
            
            center.enter().append('line')
                .attr('class', 'center');

            center.attr('x1', x(cw / 2))
                .attr('x2', x(cw / 2))
                .attr('y1', y)
                .attr('y2', y(ch / 2));

            // center marks
            var marks = court.selectAll('line.mark')
                .data([0, ch - 1]);
            
            marks.enter().append('line')
                .attr('class', 'mark');

            marks.attr('x1', x(cw / 2))
                .attr('x2', x(cw / 2))
                .attr('y1', y)
                .attr('y2', function(d) { return y(d) + y(1); });
        });
    }

    tc.margin = function(m) {
        if (arguments.length > 0) {
            margin = m;
            return tc;
        } else {
            return margin;
        }
    }

    tc.dimensions = function() {
        // return court dimensions, for utility
        return {
            width: cw,
            height: ch,
            alley: alley
        }
    }

    return tc;
}
</script>