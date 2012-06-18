var data,
    categories,
    chart,
    cities,
    colors,
    mass,
    width = 900,
    height,
    blocksize = 10,
    url = "/visible-data/data/biotech/bt.csv";

var nest = d3.nest()
    .key(function(d) { return d.city; })
    .sortValues(function(d,i) {
        return d3.ascending(d.category);
    });

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear();

var caption = d3.select('body').append('div')
    .attr('class', 'caption')
    .style('display', 'none')
    .style('position', 'absolute');

var template = _.template(
    '<h3><%= name %></h3>' +
    '<p><%= city %>, <%= state %><br>' +
    '<%= category %></p>'
);

d3.csv(url, function(resp) {
    _.each(resp, function(d, i) {
        d.id = +d.id;
        d.employees = +d.employees;
    });
    categories = _.unique(_.pluck(resp, 'category'));
    colors = d3.scale.category20()
        .domain(categories);

    mass = _.filter(resp, function(d) {
        return d.state === "MA";
    });
    data = nest.entries(mass);
    data = _.sortBy(data, function(d) { return -d.values.length; });
    height = blocksize * data.length;
    x.domain([0, 100]);
    y.domain([0, data.length]).range([0, height]);

    chart = d3.select('#city-spectrum').append('svg')
        .style('height', height)
        .style('width', width);

    cities = chart.selectAll('g.city')
        .data(data)
      .enter().append('g')
        .classed('city', true)
        .attr('transform', function(d,i) {
            return 'translate(0,'+y(i)+')';
        });

    var companies = cities.selectAll('rect.company')
        .data(function(d) {
            return _.sortBy(d.values, 'category'); 
        })
      .enter().append('rect')
        .classed('company', true)
        .attr('height', blocksize)
        .attr('width', blocksize)
        .attr('y', 0)
        .attr('x', function(d,i) { return x(i); })
        .style('fill', function(d,i) { return colors(d.category); });

    companies.on('mouseover', showCaption);
    companies.on('mousemove', showCaption);
    companies.on('mouseout', function(d, i) {
        caption.style('display', 'none');
    });

    function showCaption(d, i) {
        var position = d3.mouse(document.body);
        caption.style('display', 'block')
            .style('left', (position[0] + 10) + 'px')
            .style('top', (position[1] + 10) + 'px')
            .html(template(d));
    }

});
