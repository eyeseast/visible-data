---
title: How Dominant is Rafael Nadal?
layout: post
published: true
tags: [d3]
comments: true
scripts:
 - /visible-data/js/d3.v2.min.js
 - /visible-data/js/underscore-min.js

---
<style type="text/css">
body { position: relative; }

div.caption {
    padding: .5em;
    background-color: white;
    border: 1px solid #555;
}

.chart { 
    width: 300px;
    margin-right: 10px;
    float: left;
}

#charts {
    clear: both;
    width: 100%;
}

g.match line {
    stroke: #000;
    stroke-width: 1px;
}

svg rect {
    stroke-width: 1px;
    stroke: #444;
    fill: none;
}

svg rect.player {
    fill: Steelblue;
}

svg rect.opponent {
    fill: FireBrick;
}
</style>

From [Straight Sets][ss]:

> Novak Djokovic and Rafael Nadal play in the finals of Roland Garros on Sunday in a match guaranteed to make history. A Djokovic win would be his fourth straight major title. While technically not a Grand Slam (which must occur in the same calendar year), it would nonetheless be an astonishing accomplishment. For Nadal, a victory on Sunday would give him a record seventh French Open title, eclipsing Bjorn Borg, and further cementing his reputation as the best clay-court player ever.

[ss]: http://straightsets.blogs.nytimes.com/2012/06/09/for-djokovic-and-nadal-its-a-chess-match/

In this chart, each square represents a game won; each row is a set. What I hope this shows, is how little traction Nadal's opponents have found.

<div id="charts">
    <div id="nadal" class="chart">
        <h3>Raphael Nadal</h3>
    </div>
    <div id="djokovic" class="chart">
        <h3>Novak Djokovic</h3>
    </div>
</div>

Nadal enters the final without having dropped a set. Only one opponent has gotten to a tie-breaker. Djokovic, meanwhile, went to five sets twice and nearly lost in the quarterfinals to Jo-Wilfred Tsonga.

My money's on Nadal making history here. But Djokovic should never be underestimated.

<script type="text/javascript">
// mis en place
function translate(x,y) {
    return "translate(" + x + "," + y + ")";
}

var height = 400,
    width = 290,
    pad = 10,
    scores = {},
    urls = {
        nadal: '/visible-data/data/nadal-french-open.csv',
        djokovic: '/visible-data/data/djokovic-french-open.csv'
    },
    matches, 
    sets;

var caption = d3.select('body').append('div')
    .attr('class', 'caption')
    .style('display', 'none')
    .style('position', 'absolute');

var x = d3.scale.linear()
    .range([0, width / 2])
    .domain([0, 7]); // be thankful for tiebreakers

var y = d3.scale.linear()
    .range([0, height]);

d3.csv(urls.nadal, function(data) { plot(data, 'Nadal') });
d3.csv(urls.djokovic, function(data) { plot(data, 'Djokovic') });

function plot(data, player) {
    scores[player] = data;
    _.each(data, function(d, i) {
        d.opponent = +d.opponent;
        d.player = +d.player;
        d.set = i; // store the original set index;
    });
    
    y.domain([0, data.length]);

    var chart = window[player] = d3.select('#' + player.toLowerCase()).append('svg')
        .style('height', height)
        .style('width', width);

    sets = chart.selectAll('g.set')
        .data(data)
      .enter().append('g')
        .classed('set', true)
        .attr('transform', function(d,i) { return translate(0, y(i)); });

    sets.selectAll('rect.player')
        .data(function(d) { return d3.range(d.player)})
      .enter().append('rect')
        .classed('game player', true)
        .attr('height', 10)
        .attr('width', 10)
        .attr('y', 0)
        .attr('x', function(d,i) { return x(i); });

    sets.selectAll('rect.opponent')
        .data(function(d) { return d3.range(d.opponent); })
      .enter().append('rect')
        .classed('game opponent', true)
        .attr('height', 10)
        .attr('width', 10)
        .attr('y', 0)
        .attr('x', function(d,i) { return width - x(i) - 10; });

    sets.on('mouseover', showCaption);
    sets.on('mousemove', showCaption);
    sets.on('mouseout', function(d, i) {
        caption.style('display', 'none');
    });

    function showCaption(d, i) {
        var position = d3.mouse(document.body);
        caption.style('display', 'block')
            .style('left', (position[0] + 10) + 'px')
            .style('top', (position[1] + 10) + 'px')
            .text(player + ': ' + d.player + ' - ' + d.vs + ': ' + d.opponent);
    }

}

</script>