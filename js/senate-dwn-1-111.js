// mise en place
function slugify(text) {
    text = String(text)
        .toLowerCase()
        .replace(/[^\w\s\-]/, '')
        .replace(/[\-\s]+/, '-');
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

var height = 400,
    width = 600,
    pad = 20;

var chart = d3.select('#chart').append('svg')
    .attr('height', height + pad)
    .attr('width', width + pad)
  .append('g')
    .attr('transform', 'translate(' + pad + ',0)');

var x = d3.scale.linear()
    .domain([-1.5, 1.5])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([-1.5, 1.5])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(0)
    .tickFormat(String)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(0)
    .tickFormat(String)
    .orient('left');

// crossfilter
var scores = crossfilter(),
    byCongress = scores.dimension(function(d) { return d.Congress; });

// the chart
chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (height / 2) + ')')
    .call(xAxis);

chart.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + (width / 2) + ',0)')
    .call(yAxis);

// a caption, for use later
var caption = d3.select('body').append('div')
    .attr('class', 'caption')
    .style('display', 'none')
    .style('position', 'absolute');

function plotCongress(congress) {
    var data = byCongress.filter(congress);
    var circles = chart.selectAll('circle')
        .data(data.top(Infinity), function(d) { return d['Name']; });
    
    circles.enter()
        .append('circle')
        .attr('class', function(d) { return d['slug']; })
        .attr('cx', function(d) { return x(d['1st Dimension Coordinate']); })
        .attr('cy', function(d) { return y(d['2nd Dimension Coordinate']); })
      .transition()
        .duration(1000)
        .attr('r', 5);

    circles.transition()
        .duration(1000)
        .attr('class', function(d) { return d['slug']; })
        .attr('r', 5)
        .attr('cx', function(d) { return x(d['1st Dimension Coordinate']); })
        .attr('cy', function(d) { return y(d['2nd Dimension Coordinate']); });

    circles.exit()
        .transition()
        .duration(1000)
        .attr('r', 0)
        .remove();

    circles.on('mouseover', function(d, i) {
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
}

jQuery(function($) {
    // no-op forms
    var congress = $('[name=congress]'),
        year = $('[name=year]');

    congress.on('change', function(e) {
        var value = $(this).val();
        year.val(getYear(value));
        plotCongress(value);
        // slider.slider('value', value);
    });

    year.on('change', function(e) {
        var value = getCongress($(this).val());
        congress.val(value);
        plotCongress(value);
        // slider.slider('value', value);
    });

    $('form').submit(function(e) { 
        e.preventDefault(); 
        plotCongress(congress.val() || 111);
    });

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
    }

    Player.prototype.update = function(congress) {
        congress = congress || this.current;
        this.congress.val(congress);
        this.year.val(getYear(congress));
        plotCongress(congress);
        this.current = congress;
    };

    Player.prototype.next = function() {
        if (this.current < this.max) {
            this.current++;
            this.update();
        }
    };

    Player.prototype.previous = function() {
        if (this.current > this.min) {
            this.current--;
            this.update();
        }
    };

    window.player = new Player();

    // key controls
    d3.select(window).on('keydown', function() {
        switch (d3.event.keyCode) {
            case 37: player.previous(); break;
            case 39: player.next(); break;
        }
    })
});

d3.csv('/visible-data/data/DWN-master.csv', function(data) {
    // a little data cleaning
    window.data = data;
    _.each(data, function(d, i) {
        d['Congress'] = +d['Congress'];
        d['Party'] = PARTIES[d['Party']];
        d['1st Dimension Coordinate'] = Number(d['1st Dimension Coordinate']);
        d['2nd Dimension Coordinate'] = Number(d['2nd Dimension Coordinate']);
        d['slug'] = slugify(d['Party']);
    });
    scores.add(data);
    var start = Math.floor(Math.random() * 111);
    player.update(start);
});
