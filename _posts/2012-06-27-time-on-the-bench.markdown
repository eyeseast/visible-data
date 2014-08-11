---
title: Time on the Bench
layout: post
published: true
comments: true
tags: [d3, underscore]
scripts:
 - /visible-data/components/d3/d3.min.js
 - /visible-data/components/underscore/underscore-min.js
 - /visible-data/components/jquery/jquery.min.js
 - /visible-data/components/bootstrap/js/button.js

excerpt: "Supreme Court justices serve for life, or until they retire. But a life term means something different if a justice starts serving at 50 or 65.

With the Court's term ending tomorrow, I was curious if terms on the bench are becoming longer. Do presidents have an incentive to appoint younger judges? Or do longer lifespans in general have the side effect of extending judicial careers?"
---
<style type="text/css">
body { position: relative; }

#chart svg { width: 100%; }

div.caption {
    padding: .5em;
    background-color: white;
    border: 1px solid #555;
}
#template { display: none; visibility: hidden; }
#chart rect {
    stroke: white;
    fill: SteelBlue;
    shape-rendering: crispEdges;
}
#chart rect:hover {
    fill: FireBrick;
}
#chart text {
}
#chart .rule {
    shape-rendering: crispEdges;
    stroke: #ccc;
}
#buttons {
    margin-bottom: 1.5em;
}

</style>

Supreme Court justices serve for life, or until they retire. But a life term means something different if a justice starts serving at 50 or 65.

With the Court's term ending tomorrow, I was curious if terms on the bench are becoming longer. Do presidents have an incentive to appoint younger judges? Or do longer lifespans in general have the side effect of extending judicial careers?

The chart below shows time on the bench of every justice who has served on the high court (including the most recently appointed, whose terms will look very short right now). [Data comes from Wikipedia](http://en.wikipedia.org/wiki/List_of_Justices_of_the_Supreme_Court_of_the_United_States).

Use the buttons below to switch between a simple bar chart showing total years served and one that shows the age justices joined and left the court. Judges are listed in the order they were appointed.

<div id="buttons" class="btn-group" data-toggle="buttons-radio">
    <button class="btn served">By Time Served</button>
    <button class="btn age">By Age</button>
</div>

<div id="chart"></div>

<div id="buttons" class="btn-group" data-toggle="buttons-radio">
    <button class="btn served">By Time Served</button>
    <button class="btn age">By Age</button>
</div>

*Note that one appointment is missing: [John Rutledge](http://en.wikipedia.org/wiki/John_Rutledge) served a three-month term as chief justice after a recess appointment by George Washington, but the Senate rejected his confirmation for a full term. Rather than have a blank line in the chart (since he served less than a year), I've simply removed that row.*

<script id="template" type="x-jst">
    <h4><%= Judge %></h4>
    <p><%= Lifespan %>
    <p>
        <b>Served:</b> <%= Years %><br>
        <b>Appointed by:</b> <%= AppointedBy %><br>
        <b>Age at Confirmation:</b> <%= StartingAge %>
    </p>
</script>

<script type="text/javascript">
var pad = 5,
    height = 20,
    width = parseInt(d3.select('#chart').style('width'), 10) - pad,
    url = "/visible-data/data/supremes.csv",
    current = "served";

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear();

var chart = d3.select('#chart').append('svg'),
    axis = chart.append('g')
        .classed('axis', true)
        .attr('transform', translate(pad, height)),
    
    bottomAxis = chart.append('g')
        .classed('axis', true);

var xAxis = d3.svg.axis()
    .scale(x);

var caption = d3.select('body').append('div')
    .attr('class', 'caption')
    .style('display', 'none')
    .style('position', 'absolute');

var template = _.template($('#template').html());

function translate(x,y) {
    return "translate("+x+","+y+")";
}

function plotAges() {
    // plot ages started and retired or died
    current = "age";
    
    // set our horizontal scale from zero to max age
    x.domain([
        0,
        _.chain(data).pluck('EndingAge').max().value()
    ]);

    bars.transition()
        .duration(500)
        .attr('x', function(d) { return x(d['StartingAge']); })
        .attr('width', function(d) { return x(d.Served); });

    addText('left');
    axis.transition()
        .duration(500)
        .call(xAxis.orient('top'));

    bottomAxis.transition()
        .duration(500)
        .call(xAxis.orient('bottom'));
}

function plotServed() {
    // plot time served as simple bars
    current = "served";

    // set our horizontal scale from zero to max time served
    x.domain([0, _.chain(data).pluck('Served').max().value()]);

    bars.transition()
        .duration(500)
        .attr('x', 0)
        .attr('width', function(d) { return x(d.Served); });

    addText('right');
    axis.transition()
        .duration(500)
        .call(xAxis.orient('top'));

    bottomAxis.transition()
        .duration(500)
        .call(xAxis.orient('bottom'));
}

function addText(orient) {
    orient = orient || "right";
    var labels = chart.selectAll('text.name')
        .data(data);

    labels.enter().append('text')
        .classed('name', true);
    
    // a few things consistent
    labels.text(function(d) { return d.Judge; })
        .attr('y', function(d,i) { return y(i) + height / 2; })
        .attr('dy', '.35em') // something like vertical-align: middle

    if (orient === "right") {
        labels.attr('text-anchor', 'end') // akin to text-align: right
          //.transition()
          //  .duration(1000)
            .attr('x', width)
            .attr('dx', -3) // padding-right
    } else {
        labels.attr('text-anchor', 'start')
          //.transition()
          //  .duration(1000)
            .attr('x', 0)
            .attr('dx', 3) // padding-left
    }
}

jQuery(function($) {
    $('.served').on('click', plotServed);
    $('.age').on('click', plotAges);
});

d3.csv(url, function(data) {
    window.data = data;
    _.each(data, function(d, i) {
        d.index = i;
        d.Born = +d.Born;
        d.Appointed = +d.Appointed;

        if (d.Terminated.match(/Present/i)) {
            d.Terminated = 2012;
        } else {
            d.Terminated = +d.Terminated;
        }

        d.Died ? d.Died = +d.Died : d.Died = null;

        d.Served = d.Terminated - d.Appointed;
        d['StartingAge'] = d.Appointed - d.Born;
        d['EndingAge'] = d.Terminated - d.Born;
    });

    chart = chart.style('height', (data.length + 2) * height)
        .append('g')
        .attr('transform', translate(pad, height));

    y.domain([0, data.length]).range([0, data.length * height]);

    bottomAxis.attr('transform', translate(pad, (data.length + 1) * height))

    chart.selectAll('line')
        .data(d3.range(data.length + 1))
      .enter().append('line')
        .classed('rule', true)
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y)
        .attr('y2', y);

    window.bars = chart.selectAll('rect')
        .data(data, function(d) { return d.index; })
      .enter().append('rect')
        .attr('width', 0)
        .attr('height', height)
        .attr('y', function(d, i) { return y(i); });

    bars.on('mouseover', showCaption)
        .on('mousemove', showCaption)
        .on('mouseout', function(d) {
            caption.style('display', 'none');
        });

    function showCaption(d, i) {
        var position = d3.mouse(document.body);
        caption.style('display', 'block')
            .style('left', (position[0] + 10) + 'px')
            .style('top', (position[1] + 10) + 'px')
            .html(template(d));
    }

    // fake a click to get things rolling
    jQuery('.served').trigger('click');
});
</script>