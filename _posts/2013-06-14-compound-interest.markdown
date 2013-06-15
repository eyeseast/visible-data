---
title: Compound Interest
layout: wide
published: true
tags: [d3]
scripts:
 - /visible-data/components/d3/d3.min.js

---
<style type="text/css">
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
</style>

A little chart to remind me that compound interest is important:

<div id="chart"> </div>

<form class="adjustments" class="row">
    <div class="span4" id="principle">
        <label for="principle">Principle: <strong>$100</strong></label>
        <input type="range" name="principle" min="0" max="1000" value="100">
    </div>
    <div class="span4" id="interest">
        <label for="interest">Interest rate (annual): <strong>9%</strong></label>
        <input type="range" name="interest" min="0" max="1" step="0.01" value="0.09">
    </div>
    <div class="span4" id="years">
        <label for="years">Time (years): <strong>10</strong></label>
        <input type="range" name="years" min="5" max="50" value="10">
    </div>
</form>

The x-axis is years of investment. The y-axis is return. Principle and interest are adjustable. This comes from the simple formula for compound interest, as explained by [The Motley Fool](http://www.fool.com/how-to-invest/thirteen-steps/step-1-change-your-life-with-one-calculation.aspx?source=ii1sitlnk0000001).

<script type="text/javascript">
var margin = {top: 10, right: 30, bottom: 30, left: 90}
  , width = parseInt(d3.select('#chart').style('width'))
  , width = width - margin.left - margin.right
  , height = parseInt(d3.select('#chart').style('height'))
  , height = height - margin.top - margin.bottom;

var chart = d3.select('#chart').append('svg')
    .style('width', width + margin.left + margin.right)
    .style('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', translate(margin.left, margin.top));

var intcomma = d3.format(",.0f");

var formats = {
    principle: function(d) { return '$' + intcomma(d); },
    interest: d3.format('%'),
    years: String
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

var compound = compounder(1000, .1);

var money = chart.append('path')
    .attr('id', 'money');

// form events
d3.selectAll('input[type=range]').on('change', function() {
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
function compounder(principle, interest) {

    principle = principle || 0;
    interest = interest || 0;

    // get the total return after a given year
    function compound(year) {
        return principle * Math.pow((1 + interest), year);
    }

    compound.principle = function(i) {
        if (arguments.length < 1) return principle;
        principle = i;
        return compound;
    }

    compound.interest = function(i) {
        if (arguments.length < 1) return interest;
        interest = i;
        return compound;
    }

    return compound;
}

// render our chart
function update() {
    // get form values: principle, interest, years
    var principle = +d3.select('[name=principle]').property('value')
      , interest = +d3.select('[name=interest]').property('value')
      , years = +d3.select('[name=years]').property('value');

    // first, update scales
    compound
        .principle(principle)
        .interest(interest);

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