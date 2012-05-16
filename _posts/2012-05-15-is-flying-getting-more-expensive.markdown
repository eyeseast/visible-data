---
title: Is flying getting more expensive?
layout: post
published: true
tags: []
scripts:
 - http://d3js.org/d3.v2.min.js
 - http://documentcloud.github.com/underscore/underscore-min.js
---
Since I'm looking for flights to California and not finding anything south of $400, let's look at [the data](http://www.bts.gov/xml/atpi/src/datadisp_tableseries.xml).

<div id="chart"> </div>

<table id="data" class="table">
	<thead>Average US Airfare, 1995 - 2011</thead>
	<tbody></tbody>
</table>

<script type="text/javascript">
var url = "/visible-data/data/AirFares.csv";
d3.csv(url, function(data) {
    var table = d3.select('#data').select('tbody')
        .selectAll('tr')
        .data(data)
      .enter().append('tr')
        .selectAll('td')
        .data(function(d) { return _.values(d); })
      .enter().append('td')
        .text(function(d, i) {
        	if (i === 2) { return '$' + d; }
        	return d;
        });
});
</script>