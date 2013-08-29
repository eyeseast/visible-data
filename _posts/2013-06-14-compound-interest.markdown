---
title: Compound Interest
layout: wide
published: true
tags: [d3]
scripts:
 - /visible-data/components/d3/d3.min.js
 - /visible-data/components/underscore/underscore-min.js

excerpt: A little chart to remind me that compound interest is important.
comments: true
---
<style type="text/css">
html,
body {
    position: relative;
}

label { display: block; }

#chart {
    width: 100%;
    height: 500px;
}

#money {
    stroke: Steelblue;
    stroke-width: 1;
    fill: none;
}

.point {
    stroke: Steelblue;
    stroke-width: .75;
    fill: #fff;
}

.axis .tick {
    stroke: #444;
    stroke-width: .5;
}

.background {
    fill: #fff;
}

.caption {
    background-color: white;
    border: 1px solid #555;
    border-radius: 3px;
    display: none;
    max-width: 150px;
    padding: .5em;
    position: absolute;
}

.verticle {
    fill: none;
    stroke: #444;
    stroke-width: 0;
}
</style>

A little chart to remind me that compound interest is important:

<div id="chart"> </div>

<form class="adjustments clearfix" role="form">
    <div class="form-group col-md-3" id="principal">
        <label for="principal">Principal: <strong>$100</strong></label>
        <input type="range" name="principal" min="0" max="1000" value="100" class="form-control">
    </div>
    <div class="form-group col-md-3" id="interest">
        <label for="interest">Interest rate (annual): <strong>9%</strong></label>
        <input type="range" name="interest" min="0" max="1" step="0.01" value="0.09" class="form-control">
    </div>
    <div class="form-group col-md-3" id="years">
        <label for="years">Time (years): <strong>10</strong></label>
        <input type="range" name="years" min="5" max="50" value="10" class="form-control">
    </div>
    <div class="form-group col-md-3" id="mode">
        <p>Mode:</p>
        <label for="mode" class="radio-inline">
            <input type="radio" name="mode" value="simple" checked> Simple
        </label>
        <label for="mode" class="radio-inline">
            <input type="radio" name="mode" value="continuous"> Continuous
        </label>
    </div>
</form>

The x-axis is years of investment. The y-axis is return. Principal and interest are adjustable. Choose either the simple formula for compound interest, as explained by [The Motley Fool](http://www.fool.com/how-to-invest/thirteen-steps/step-1-change-your-life-with-one-calculation.aspx?source=ii1sitlnk0000001), or [continous compounding](http://en.wikipedia.org/wiki/Compound_interest#Continuous_compounding).

<script type="x-jst" id="caption-template">
<h4><%= value %></h4>
<p><%= principal %> initial investment compounded over <%= year %> years at <%= interest %> interest.</p>
</script>

<script type="text/javascript">
var margin = {top: 10, right: 30, bottom: 30, left: 90}
  , width = parseInt(d3.select('#chart').style('width'))
  , width = width - margin.left - margin.right
  , height = parseInt(d3.select('#chart').style('height'))
  , height = height - margin.top - margin.bottom;

var chart = d3.select('#chart').append('svg')
    .style('width', (width + margin.left + margin.right) + 'px')
    .style('height', (height + margin.top + margin.bottom) + 'px')
  .append('g')
    .attr('transform', translate(margin.left, margin.top));

var intcomma = d3.format(",.0f");

var formats = {
    principal: function(d) { return '$' + intcomma(d); },
    interest: d3.format('%'),
    years: String,
    mode: String
};

var x = d3.scale.linear()
    .domain([0, 20])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, 100000])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickFormat(String);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickFormat(function(d) { return '$' + intcomma(d); });

// caption
var caption = d3.select('body').append('div')
    .attr('class', 'caption');

var template = _.template(d3.select('#caption-template').html());

// mouseover (using a background rect)
var background = chart.append('rect')
    .attr('class', 'background')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height);

var verticle = chart.append('line')
    .attr('class', 'verticle')
    .attr('y1', 0)
    .attr('y2', height);

verticle
    .on('mouseover', showCaption)
    .on('mouseout', hideCaption);

background
    .on('mouseover', showCaption)
    .on('mousemove', showCaption)
    .on('mouseout', hideCaption);

function hideCaption() {
    caption.style('display', 'none');
    verticle.style('stroke-width', 0);
}

function showCaption() {
    var position = d3.mouse(document.body)
      , year = x.invert(d3.mouse(this)[0])
      , value = compound(year);

    caption
        .style('display', 'block')
        .style('left', (position[0] + 10) + 'px')
        .style('top', (position[1] + 10) + 'px')
        .html(template({ 
            value: formats.principal(value),
            year: Math.round(year),
            interest: formats.interest(compound.interest()),
            principal: formats.principal(compound.principal())
        }));

    verticle
        .attr('x1', x(year))
        .attr('x2', x(year))
        .attr('y1', y(value))
        .style('stroke-width', 1);
}

chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', translate(0, height))
    .call(xAxis);

chart.append('g')
    .attr('class', 'y axis')
    .attr('transform', translate(0,0))
    .call(yAxis);

var line = d3.svg.line()
    .x(x)
    .y(function(d) { return y(compound(d)); });

// generate a compounding function
var compound = compounder(100, .1);

// the important line
var money = chart.append('path')
    .attr('id', 'money');

// form events
d3.selectAll('input[type=range],input[type=radio]').on('change', function() {
    // redraw charge on form change
    update();

    // update displayed numbers
    var parent = this.parentNode
      , value = this.value
      , display = d3.select(parent).select('strong')
      , format = formats[this.name];

    display.text(format(value));
});

// initial update
update();

// core functions
function compounder(principal, interest) {

    principal = principal || 0;
    interest = interest || 0;
    continuous = false;

    // get the total return after a given year
    function compound(year) {
        return continuous ?
            principal * Math.pow(Math.E, interest * year) :
            principal * Math.pow((1 + interest), year);
    }

    compound.principal = function(i) {
        if (arguments.length < 1) return principal;
        principal = i;
        return compound;
    }

    compound.interest = function(i) {
        if (arguments.length < 1) return interest;
        interest = i;
        return compound;
    }

    compound.continuous = function(i) {
        if (arguments.length < 1) return continuous;
        continuous = Boolean(i);
        return compound;
    }

    return compound;
}

// render our chart
function update() {
    // get form values: principal, interest, years
    var principal = +d3.select('[name=principal]').property('value')
      , interest = +d3.select('[name=interest]').property('value')
      , years = +d3.select('[name=years]').property('value')
      , continuous = d3.select('[name=mode]:checked').property('value') === "continuous";

    // first, update scales
    compound
        .principal(principal)
        .interest(interest)
        .continuous(continuous);

    x.domain([0, years]);
    y.domain([0, compound(years)]);

    // update axes
    d3.select('.x.axis').call(xAxis);
    d3.select('.y.axis').call(yAxis);

    // add a year to get the full range
    years = d3.range(years + 1);

    money.datum(years)
        .attr('d', line);

    // put some dots on it
    var circles = chart.selectAll('circle.point')
        .data(years);
    
    circles.enter().append('circle')
        .attr('class', 'point')
        .attr('r', 3);
    
    circles
        .attr('cx', x)
        .attr('cy', function(d) { return y(compound(d)); });

    circles.exit().remove();
}

function translate(x, y) {
    return "translate("+x+","+y+")"; 
}

</script>