---
title: Responsive Charts with D3
layout: post
published: true
comments: true
tags: [d3]
scripts:
 - /visible-data/components/d3/d3.min.js
 - /visible-data/components/underscore/underscore-min.js
 - /visible-data/components/highlightjs/highlight.pack.js

styles:
 - /visible-data/components/highlightjs/styles/default.css

excerpt: "Charts need to work everywhere, too. The trick is keeping track of lots of moving parts."
---
<style type="text/css">
.bar rect {
    stroke: #fff;
    shape-rendering: crispEdges;
}

.bar rect.background {
    fill: #eee;
}

.bar rect.percent {
    fill: #74c476;
}

.bar:hover rect.percent {
    fill: #a1d99b;
}

.bar text {
    font-size: 12px;
    fill: #333;
}

.axis line {
    stroke: #ccc;
    stroke-width: 1;
}

line.median {
    stroke: #777;
    stroke-width: 1;
}

</style>

A confession: I'm starting to hate choropleth maps.

When it comes to comes to comparing U.S. states, especially where there's no obvious geographic pattern, a map is [often the wrong choice](http://www.ericson.net/content/2011/10/when-maps-shouldnt-be-maps/).

So, following my posts on [responsive maps](/visible-data/2013/08/26/responsive-d3/) and [legends](/visible-data/2013/08/27/responsive-legends-with-d3/), let's make a bar chart, and let's make it responsive:

<div id="chart">
    <h4>Percent of adults over 25 with at least a bachelor's degree:</h4>
    <p><strong>Median:</strong> <span class="median"></span></p>
    <small>Source: <cite><a href="http://census.gov">U.S. Census Bureau</a></cite>, via <cite><a href="http://beta.censusreporter.org/compare/01000US/040/table/?release=acs2011_1yr&table=B15003">Census Reporter</a></cite></small>
</div>

Bar charts aren't especially sexy.

Our brains, however, are wired to parse differences in length faster than differences in color. That means you'll figure out a bar chart more quickly than a choropleth map, and you won't be confused by other other signals (area, position or shape, for example).

Charts (bar and otherwise) end up being slightly more complicated to resize than maps, if only because there are more moving parts. In the chart above, I have a top and bottom axis, labels, bars representing data (with another set as background) and ticks representing the median data point. Each of those needs to be adjusted when the screen size changes.

Ultimately, the process is roughly the same as making a [responsive map](/visible-data/2013/08/26/responsive-d3/), there's just more stuff to keep track of.

## How to make a responsive bar chart: ##

1. Size and scale SVG elements based on their containers.
2. Reset scales when the window resizes.
3. Resize all the things.

### 1. Size and scale SVG elements based on their containers. ###

Just as before, start with a responsive framework and set initial sizes based on containers. This lets you (mostly) control your layout with CSS and class names, instead of having to keep CSS and JavaScript in sync.

Do this, and your charts will load with the correct size. Here's a code snippet:

```javascript
var margin = {top: 30, right: 10, bottom: 30, left: 10}
  , width = parseInt(d3.select('#chart').style('width'), 10)
  , width = width - margin.left - margin.right
  , barHeight = 20
  , percent = d3.format('%');

// scales and axes
var x = d3.scale.linear()
    .range([0, width])
    .domain([0, .4]); // hard-coding this because I know the data

// ordinal scales are easier for uniform bar heights
// I'll set domain and rangeBands after data loads
var y = d3.scale.ordinal();

var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(percent);
```

I'm using [Mike Bostock's margin conventions](http://bl.ocks.org/mbostock/3019563); throughout my code, I can use `width` without further adjustment. I'll set a `height` variable later, since it's data-dependent and will be a multiple of `barHeight`.

### Reset scales when the window resizes ###

Spend enough time with D3, and you start to realize that scales are everything. Get your scales right and everything is easier. Misplace a number or get a calculation wrong and your charts fall apart.

Fortunately, this is pretty simple. Again, I'm catching the `resize` event on `window` and running a function:

```javascript
d3.select(window).on('resize', resize); 

function resize() {
    // update width
    width = parseInt(d3.select('#chart').style('width'), 10);
    width = width - margin.left - margin.right;

    // reset x range
    x.range([0, width]);

    // do the actual resize...
}
```
### Resize all the things ###

Here's the list again:

 - top axis
 - bottom axis
 - background bars
 - foreground (data) bars
 - labels (maybe)
 - median ticks


```javascript
d3.select(window).on('resize', resize); 

function resize() {
    // update width
    width = parseInt(d3.select('#chart').style('width'), 10);
    width = width - margin.left - margin.right;

    // resize the chart
    x.range([0, width]);
    d3.select(chart.node().parentNode)
        .style('height', (y.rangeExtent()[1] + margin.top + margin.bottom) + 'px')
        .style('width', (width + margin.left + margin.right) + 'px');

    chart.selectAll('rect.background')
        .attr('width', width);

    chart.selectAll('rect.percent')
        .attr('width', function(d) { return x(d.percent); });

    // update median ticks
    var median = d3.median(chart.selectAll('.bar').data(), 
        function(d) { return d.percent; });
    
    chart.selectAll('line.median')
        .attr('x1', x(median))
        .attr('x2', x(median));


    // update axes
    chart.select('.x.axis.top').call(xAxis.orient('top'));
    chart.select('.x.axis.bottom').call(xAxis.orient('bottom'));

}
```
I'm calculating width based on the container element and margins, as I did before, and updating my x-scale's range. After that, I just go down my list above and resize.

First, I'm resizing my `svg` element. That's a little ugly, because `chart` is actually a `g` element translated by `margin.left` and `margin.top`, so I need to re-select the parent node. (It would be nice if D3 had a `parent` accessor, like jQuery.)

Next, I resize the two `rect` elements. Background is easy; it's a full-width bar (and can be skipped if you don't like having a background offset). For the foreground bar, I'm recalculating width based on the updated x-scale. Simple enough. Rememeber, data is already bound, which helps with next step.

I need to calculate the median again. I could have set this as a global when I loaded data, but I have enough globals in my <del>life</del><ins>code</ins>. Fortunately, as above, I can grab my dataset out of the chart with `chart.selectAll('.bar').data()` and calculate a median from that. My median ticks are line elements, so I set the `x1` and `x2` attibutes again.

Last up: axes. This is even easier. Just select the container elements (in my case, `.x.axis.top` and `.x.axis.bottom`) and call the axis object again. Here, I have two version--top and bottom--so I set the orientation each time.

That's it. There are a lot of little steps, but nothing here should be too much trouble, even for more complicated charts.

Go make your visualizations work everywhere.

<script type="text/javascript">
var url = "/visible-data/data/census/bachelors-degrees.csv"
  , margin = {top: 30, right: 10, bottom: 30, left: 10}
  , width = parseInt(d3.select('#chart').style('width'), 10)
  , width = width - margin.left - margin.right
  , height = 200 // placeholder
  , barHeight = 20
  , spacing = 3
  , percent = d3.format('%');

// scales and axes
var x = d3.scale.linear()
    .range([0, width])
    .domain([0, .4]); // hard-coding this because I know the data

var y = d3.scale.ordinal();

var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(percent);

// create the chart
var chart = d3.select('#chart').append('svg')
    .style('width', (width + margin.left + margin.right) + 'px')
  .append('g')
    .attr('transform', 'translate(' + [margin.left, margin.top] + ')');

d3.csv(url).row(function(d) {
    d.Total = +d.Total;
    d["Bachelor's degree"] = +d["Bachelor's degree"];
    d.percent = d["Bachelor's degree"] / d.Total;

    return d;
}).get(function(err, data) {
    // sort
    data = _.sortBy(data, 'percent').reverse();

    // set y domain
    y.domain(d3.range(data.length))
        .rangeBands([0, data.length * barHeight]);

    // set height based on data
    height = y.rangeExtent()[1];
    d3.select(chart.node().parentNode)
        .style('height', (height + margin.top + margin.bottom) + 'px')

    // render the chart

    // add top and bottom axes
    chart.append('g')
        .attr('class', 'x axis top')
        .call(xAxis.orient('top'));

    chart.append('g')
        .attr('class', 'x axis bottom')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis.orient('bottom'));

    var bars = chart.selectAll('.bar')
        .data(data)
      .enter().append('g')
        .attr('class', 'bar')
        .attr('transform', function(d, i) { return 'translate(0,'  + y(i) + ')'; });

    bars.append('rect')
        .attr('class', 'background')
        .attr('height', y.rangeBand())
        .attr('width', width);

    bars.append('rect')
        .attr('class', 'percent')
        .attr('height', y.rangeBand())
        .attr('width', function(d) { return x(d.percent); })

    bars.append('text')
        .text(function(d) { return d.Name; })
        .attr('class', 'name')
        .attr('y', y.rangeBand() - 5)
        .attr('x', spacing);

    // add median ticks
    var median = d3.median(data, function(d) { return d.percent; });

    d3.select('span.median').text(percent(median));

    bars.append('line')
        .attr('class', 'median')
        .attr('x1', x(median))
        .attr('x2', x(median))
        .attr('y1', 1)
        .attr('y2', y.rangeBand() - 1);
});

// resize
d3.select(window).on('resize', resize); 

function resize() {
    // update width
    width = parseInt(d3.select('#chart').style('width'), 10);
    width = width - margin.left - margin.right;

    // resize the chart
    x.range([0, width]);
    d3.select(chart.node().parentNode)
        .style('height', (y.rangeExtent()[1] + margin.top + margin.bottom) + 'px')
        .style('width', (width + margin.left + margin.right) + 'px');

    chart.selectAll('rect.background')
        .attr('width', width);

    chart.selectAll('rect.percent')
        .attr('width', function(d) { return x(d.percent); });

    // update median ticks
    var median = d3.median(chart.selectAll('.bar').data(), 
        function(d) { return d.percent; });
    
    chart.selectAll('line.median')
        .attr('x1', x(median))
        .attr('x2', x(median));


    // update axes
    chart.select('.x.axis.top').call(xAxis.orient('top'));
    chart.select('.x.axis.bottom').call(xAxis.orient('bottom'));

}

// highlight code blocks
hljs.initHighlighting();

</script>
