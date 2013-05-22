---
title: Partisanship in the House
layout: wide
published: true
comments: false
tags: [d3, underscore]

scripts:
 - /visible-data/components/d3/d3.min.js
 - /visible-data/components/underscore/underscore-min.js
 - /visible-data/components/underscore.string/dist/underscore.string.min.js
 - /visible-data/js/parties.js
 - /visible-data/js/states.js
 - /visible-data/components/jquery/jquery.js

---
<style type="text/css">
body { position: relative; }

div.caption {
	padding: .5em;
	background-color: white;
	border: 1px solid #555;
}

#congress {
	margin-top: 1em;
}
#buttons {
	margin-top: 1.75em;
}

</style>

Inspired by [XKCD](http://xkcd.com/1127/large/) and following up on [partisanship in the Senate](/visible-data/2012/05/21/partisanship-over-111-congresses/), here is what the House has looked like since 1789.

<div id="chart-wrapper" class="row">
	<div id="chart" class="span8"> </div>
	<div id="buttons" class="btn-group span2">
		<a class="btn" id="previous">
			<i class="icon-step-backward" id="previous-icon" data-original-title="Earlier"> </i>
		</a>
		<a class="btn" id="random">
			<i class="icon-random" data-original-title="Random"> </i>
		</a>
		<a class="btn" id="next">
			<i class="icon-step-forward" id="next-icon" data-original-title="Later"> </i>
		</a>
	</div>
	<form class="form-horizontal span4" id="congress">
		<div class="row">
			<div class="span3">
				<label>Year: </label>
				<input name="year" class="span2" 
					type="text" value="2010" 
					max="2010"
					min="1789" />
			</div>
			<div class="span2">
				<label>Congress #:</label>
				<input name="congress" class="span2" 
					type="text" value="111" 
					max="111"
					min="1" />
			</div>
		</div>
	</form>
    <div id="parties" class="span4"></div>
</div>

<table id="members" class="table table-condensed table-striped span12">
    <thead></thead>
    <tbody></tbody>
</table>

<script type="text/javascript">
// mise en place
function memberKey(d) { return d['ICPSR ID Number']; }

function slugify(text) {
    text = String(text)
        .toLowerCase()
        .replace(/[^\w\s\-]/g, '')
        .replace(/[\-\s]+/g, '-');
    return text;
}

function getCongress(year) {
    // return congress number for a given year
    return Math.floor((year - 1789) / 2 + 1);
}

function getYear(congress) {
    // return starting year for congress number
    return 1789 + (congress * 2) - 2;
}

function translate(x, y) {
	return "translate("+x+","+y+")"; 
}

var margin = { top: 10, right: 10, bottom: 10, left: 10 }
  , height = 400
  , width = 600
  , url = "/visible-data/data/house-DWN-1-111.csv"
  , byCongress
  , chart
  , player;

var template = _.template('<h4><%= Name %></h4><p><%= Party %> (<%= State %>)</p>');

var nest = d3.nest().key(function(d) { return d.Congress; });

// a caption, for use later
var caption = d3.select('body').append('div')
    .attr('class', 'caption')
    .style('display', 'none')
    .style('position', 'absolute');

// fetch data early and often
d3.csv(url, function(data) {
    window.data = data;
    var state;
    _.each(data, function(d, i) {
        d.Congress = +d.Congress;
        d.Party = PARTIES[d.Party];
        d['1st Dimension Coordinate'] = Number(d['1st Dimension Coordinate']);
        d['2nd Dimension Coordinate'] = Number(d['2nd Dimension Coordinate']);
        if (_.has(STATES, d['State Code'])) {
            // clean this up a bit
            state = STATES[d['State Code']]['name'].toLowerCase();
            state = _.str.titleize(state);
            d['State'] = state;
            d['Postal'] = STATES[d['State Code']]['abbr'];
        }
        
        d.slug = slugify(d.Party);
    });

    byCongress = nest.map(data);

    jQuery(function($) {
    	// get a player
    	player = new Player();
    	player.random();

    	// key controls
    	d3.select(window).on('keydown', function() {
    	    switch (d3.event.keyCode) {
    	        case 37: player.previous(); break;
    	        case 39: player.next(); break;
    	    }
    	});
    });

});

// setup our chart, wrapped in a closure
chart = d3.select('#chart').append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
  .append('g')
    .attr('transform', translate(margin.left, 0));

var x = d3.scale.linear()
    .domain([-1.5, 1.5])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([-1.5, 1.5])
    .range([0, height]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(3)
    .tickFormat(String)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(3)
    .tickFormat(String)
    .orient('left');

// the chart
chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (height / 2) + ')')
    .call(xAxis);

chart.append('text')
    .attr('class', 'axis label')
    .attr('transform', 'translate(0,' + (height / 2 - 5) + ')')
    .text('1st Dimension');

chart.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + (width / 2) + ',0)')
    .call(yAxis);

chart.append('text')
    .attr('class', 'axis label')
    .attr('transform', translate(width / 2 + 5), margin.top + margin.bottom)
    .text('2nd Dimension');


function plotCongress(congress) {
    // chart first and second dimentions on a scatterplot
    var data = byCongress[congress];
    var circles = chart.selectAll('circle')
        .data(data, memberKey);
    
    circles.enter()
        .append('circle')
        .attr('class', function(d) { return d.slug; })
        .attr('cx', function(d) { return x(d['1st Dimension Coordinate']); })
        .attr('cy', function(d) { return y(d['2nd Dimension Coordinate']); })
      .transition()
        .duration(1000)
        .attr('r', 4);

    circles.transition()
        .duration(1000)
        .attr('class', function(d) { return d.slug; })
        .attr('r', 4)
        .attr('cx', function(d) { return x(d['1st Dimension Coordinate']); })
        .attr('cy', function(d) { return y(d['2nd Dimension Coordinate']); });

    circles.exit()
        .transition()
        .duration(1000)
        .attr('r', 0)
        .remove();

    circles.on('mouseover', function(d, i) {
        var position = d3.mouse(document.body);
        this.setAttribute('r', 8);
        caption.style('display', 'block')
            .style('left', (position[0] + 10) + 'px')
            .style('top', (position[1] + 10) + 'px')
            .html(template(d));
    })
    .on('mouseout', function(d, i) {
        this.setAttribute('r', 4);
        caption.style('display', 'none');
    });

}

function memberTable(congress) {
	// build a table of members
    var data = byCongress[congress].sort(function(a, b) {
        return a['1st Dimension Coordinate'] - b['1st Dimension Coordinate'];
    });
    
    var fields = [
        'Name', 'State', 'District', 'Party', 
        '1st Dimension Coordinate', 
        '2nd Dimension Coordinate'];
	
    var table = d3.select('#members');

	// headings
	table.select('thead').selectAll('th')
	    .data(fields)
	  .enter().append('th')
	    .text(String);

    // rows and columns
    var rows = table.select('tbody').selectAll('tr')
        .data(data, memberKey);

    rows.enter()
        .append('tr')
        .order();

    rows.exit().remove();

    rows.sort(function(a, b) {
        return a['1st Dimension Coordinate'] - b['1st Dimension Coordinate'];
    });


    rows.selectAll('td')
        .data(function(d) { return _.map(fields, function(f) {
            return d[f];
        }) 
    })
      .enter().append('td')
        .text(String);
}

function plotParties(congress) {
    // a bar chart of party breakdown
    var data = byCongress[congress]
        parties = _.countBy(data, 'Party');

    return parties;
}

function Player() {
    this.congress = $('[name=congress]');
    this.year = $('[name=year]');
    this.min = 1;
    this.max = 111;
    this.current = Number(this.congress.val() || this.max);

    var player = this;
    $('#next').on('click', function(e) {
        e.preventDefault();
        player.next();
    });

    $('#previous').on('click', function(e) {
        e.preventDefault();
        player.previous();
    });

    $('#random').on('click', function(e) {
        e.preventDefault();
        player.random();
    });

    this.congress.on('change', function(e) {
        var value = $(this).val();
        player.update(value);
    });

    this.year.on('change', function(e) {
        var value = getCongress($(this).val());
        player.update(value);
    });

    $('form').submit(function(e) { 
        e.preventDefault(); 
        player.update();
    });
}

Player.prototype.update = function(congress) {
    congress = congress || this.congress.val();
    this.congress.val(congress);
    this.year.val(getYear(congress));
    plotCongress(congress);
    memberTable(congress);
    plotParties(congress);
    this.current = congress;
};

Player.prototype.next = function() {
    if (this.current < this.max) {
        this.update(this.current + 1);
    }
};

Player.prototype.previous = function() {
    if (this.current > this.min) {
        this.update(this.current - 1);
    }
};

Player.prototype.random = function() {
    this.update(Math.floor(Math.random() * 111));
};

</script>
