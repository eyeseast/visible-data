// a function that draws a tennis court
// takes an element (or selector) and an
// options object
// requires D3
function tennisCourt(container, options) {
	var translate = function(x,y) {
		return 'translate(' + x + ',' + y + ')';
	}

	options || (options = {});
	var cw = 36, // standard court dimensions, in feet
	    ch = 78,
	    pad = options.padding || 10,
	    width = options.width || parseInt(d3.select(container).style('width')) - pad * 2,
	    height = width * (ch / cw);

	// scales
	var x = d3.scale.linear()
	    .domain([0, cw]) // width of a court
	    .range([0, width]);

	var y = d3.scale.linear()
	    .domain([0, ch])
	    .range([0, height]);

	var court = d3.select(container).append('svg')
	    .style('width', width + pad * 2)
	    .style('height', height + pad * 2)
	    .append('g')
	    .attr('transform', translate(pad,pad));

	// baselines
	court.selectAll('line.baseline')
	    .data([0, ch / 2, ch])
	  .enter().append('line')
	    .attr('class', 'baseline')
	    .attr('class', 'Baseline')
	    .attr('x1', 0)
	    .attr('x2', x(cw))
	    .attr('y1', y)
	    .attr('y2', y);

	// sidelines
	court.selectAll('line.sideline')
	    .data([0, 4.5, cw - 4.5, cw])
	  .enter().append('line')
	    .attr('class', 'sideline')
	    .attr('x1', x)
	    .attr('x2', x)
	    .attr('y1', 0)
	    .attr('y2', y(ch));

	// service boxes
	var service = [ch / 2 + 21, ch / 2 - 21];
	court.selectAll('line.service')
	    .data(service)
	  .enter().append('line')
	    .attr('class', 'service')
	    .attr('x1', x(4.5)) // start at the alley
	    .attr('x2', x(cw - 4.5)) // end at the opposite alley
	    .attr('y1', y)
	    .attr('y2', y);

	court.selectAll('line.center')
	    .data(service)
	  .enter().append('line')
	    .attr('class', 'center')
	    .attr('x1', x(cw / 2))
	    .attr('x2', x(cw / 2))
	    .attr('y1', y)
	    .attr('y2', y(ch / 2));

	// center marks
	court.selectAll('line.mark')
	    .data([0, ch - 1])
	  .enter().append('line')
	    .attr('class', 'mark')
	    .attr('x1', x(cw / 2))
	    .attr('x2', x(cw / 2))
	    .attr('y1', y)
	    .attr('y2', function(d) { return y(d) + y(1); });

	return court;
}