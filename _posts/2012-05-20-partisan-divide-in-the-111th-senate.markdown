---
title: Partisan Divide in the 111th Senate
layout: post
published: true
comments: true
tags: [d3]
scripts:
 - http://d3js.org/d3.v2.min.js
 - http://documentcloud.github.com/underscore/underscore-min.js

excerpt: "The best dataset to understand political polarization is [Voteview's DW-Nominate scores](http://voteview.com/dwnominate.asp). I'm only looking at the Senate here, both to reduce the numbef of points and to make it easier to chart the first time. My goal is to eventually plot every congress and see how alignments have shifted over the past two centuries."

---
<style type="text/css">
body { position: relative; }
svg {
	font-family: sans-serif;
	font-size: 10px;
}
g.axis path {
	fill: none;
	stroke: #444;
	stroke-width: .5;
}

svg circle {
	stroke: #444;
	stroke-width: .5;
	fill: white;
}

svg circle.Democrat {
	fill: SteelBlue;
}

svg circle.Republican {
	fill: FireBrick;
}

div.caption {
	padding: 1em;
	background-color: white;
	border: 1px solid #333;
}

</style>

The best dataset to understand political polarization is [Voteview's DW-Nominate scores](http://voteview.com/dwnominate.asp). I'm only looking at the Senate here, both to reduce the numbef of points and to make it easier to chart the first time. My goal is to eventually plot every congress and see how alignments have shifted over the past two centuries.

<div id="chart"> </div>

In the chart above, the X axis shows Voteview's First Dimension Coordinate, roughly the degree to which a candidate favors or opposes government intervention in the economy (left is more intervention). The Y axis shows Voteview's Second Dimension, which has in the past shown views on social issues and civil rights, though this measure has become less important. "After 1980 there is considerable evidence that the South realigns and the 2nd dimension is no longer important," [Voteview's authors write](http://voteview.com/dwnominate.asp). 

The basic pattern here should be pretty obvious. Every Democrat (in blue) is to the left -- even if only slightly -- of every Republican. There is zero crossover.

This is actually a fairly recent phenominon, as liberal Republicans and conservative Democrats have retired or been voted out (some in primaries, others in general elections). I'm hoping to be able to show that soon.

<script type="text/javascript">
// http://voteview.com/party3.htm
var PARTIES = {
    "214": "Non-Partisan and Republican", 
    "215": "War Democrat", 
    "212": "United Republican", 
    "213": "Progressive Republican", 
    "603": "Ind. Whig", 
    "6000": "Crawford Federalist", 
    "555": "Jackson", 
    "337": "Anti-Monopoly Democrat", 
    "310": "American", 
    "331": "Ind. Republican", 
    "333": "Ind. Republican-Democrat", 
    "29": "Whig", 
    "9999": "Unknown", 
    "114": "Readjuster", 
    "117": "Readjuster Democrat", 
    "4000": "Anti-Administration", 
    "403": "Law and Order", 
    "110": "Popular Sovereignty Democrat", 
    "112": "Conservative", 
    "336": "Anti-Monopolist", 
    "119": "United Democrat", 
    "118": "Tariff for Revenue Democrat", 
    "25": "National Republican", 
    "26": "Anti Masonic", 
    "1111": "Liberty", 
    "8888": "Adams-Clay Republican", 
    "22": "Adams", 
    "46": "States Rights", 
    "44": "Nullifier", 
    "6666": "Crawford Republican", 
    "43": "Calhoun Nullifier", 
    "40": "Anti-Democrat and States Rights", 
    "41": "Anti-Jackson Democrat", 
    "1": "Federalist", 
    "347": "Prohibitionist", 
    "326": "National Greenbacker", 
    "341": "People's", 
    "401": "Fusionist", 
    "301": "Free Soil Democrat", 
    "9": "Jefferson Republican", 
    "340": "Populist", 
    "328": "Independent", 
    "329": "Ind. Democrat", 
    "402": "Liberal", 
    "308": "Free Soil American and Democrat", 
    "200": "Republican", 
    "203": "Unconditional Unionist", 
    "202": "Union Conservative", 
    "522": "American Labor", 
    "206": "Unionist", 
    "300": "Free Soil", 
    "208": "Liberal Republican", 
    "302": "Free Soil Whig", 
    "1116": "Conservative Republican", 
    "304": "Anti-Slavery", 
    "1275": "Anti-Jackson", 
    "380": "Socialist", 
    "108": "Anti-Lecompton Democrat", 
    "4444": "Union", 
    "1346": "Jackson Republican", 
    "9000": "Unknown", 
    "103": "Democrat and Anti-Mason", 
    "100": "Democrat", 
    "101": "Jackson Democrat", 
    "8000": "Adams-Clay Federalist", 
    "104": "Van Buren Democrat", 
    "105": "Conservative Democrat", 
    "11": "Jefferson Democrat", 
    "10": "Anti-Federalist", 
    "13": "Democrat-Republican", 
    "3333": "Opposition", 
    "48": "States Rights Whig", 
    "5000": "Pro-Administration", 
    "1061": "Emancipationist", 
    "1060": "Silver", 
    "37": "Constitutional Unionist", 
    "7777": "Crawford Republican", 
    "34": "Whig and Democrat", 
    "537": "Farmer-Labor", 
    "356": "Union Labor", 
    "355": "Union", 
    "354": "Silver Republican", 
    "353": "Ind. Silver Republican", 
    "370": "Progressive", 
    "7000": "Jackson Federalist"
}

// load the data
d3.csv('/visible-data/data/DWN-111.csv', function(data) {
	var height = 400,
	    width = 600,
	    pad = 20;

	// a little data cleaning
	window.data = data;
	_.each(data, function(d, i) {
		d['Congress'] = +d['Congress'];
		d['Party'] = PARTIES[d['Party']];
		d['1st Dimension Coordinate'] = Number(d['1st Dimension Coordinate']);
		d['2nd Dimension Coordinate'] = Number(d['2nd Dimension Coordinate']);
	});

	// mise en place
	window.chart = d3.select('#chart').append('svg')
        .attr('height', height + pad)
        .attr('width', width + pad)
      .append('g')
        .attr('transform', 'translate(' + pad + ',0)');

    // axes and scales
    var first = _.pluck(data, '1st Dimension Coordinate'),
        second = _.pluck(data, '2nd Dimension Coordinate');

    var x = d3.scale.linear()
        .domain([-1.5, 1.5])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([-1.5, 1.5])
        .range([height, 0]);

    window.xAxis = d3.svg.axis()
        .scale(x)
        .ticks(3)
        .tickFormat(String)
        .orient('bottom');

    window.yAxis = d3.svg.axis()
        .scale(y)
        .ticks(3)
        .tickFormat(String)
        .orient('left');

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    // a caption, for use later
    var caption = d3.select('body').append('div')
        .attr('class', 'caption')
        .style('display', 'none')
        .style('position', 'absolute');

    // actual data
    chart.selectAll('circle')
        .data(data, function(d) { return d['Name']; })
      .enter().append('circle')
        .attr('class', function(d) { return d['Party']; })
        .attr('r', 5)
        .attr('cx', function(d) { return x(d['1st Dimension Coordinate']); })
        .attr('cy', function(d) { return y(d['2nd Dimension Coordinate']); })
        .on('mouseover', function(d, i) {
        	var position = d3.mouse(document.body);
        	this.setAttribute('r', 10);
        	caption.style('display', 'block')
        		.style('left', (position[0] + 10) + 'px')
        		.style('top', (position[1] + 10) + 'px')
        		.text(d['Name'] + ': ' + d['1st Dimension Coordinate']);
        })
        .on('mouseout', function(d, i) {
        	this.setAttribute('r', 5);
        	caption.style('display', 'none');
        });

});

</script>