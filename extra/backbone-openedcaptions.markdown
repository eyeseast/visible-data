---
title: Opened Captions Live Demo
layout: post
scripts:
 - /visible-data/components/d3/d3.v2.min.js
 - /visible-data/components/socket.io-client/dist/socket.io.min.js
 - /visible-data/components/jquery/jquery.min.js
 - /visible-data/components/underscore/underscore.js
 - /visible-data/components/backbone/backbone.js
 - /visible-data/components/backbone-opened-captions/models.js

---

A live-updating chart of words used on CSPAN:

<div id="chart"> </div>

<script type="text/javascript">
var url = "http://openedcaptions.com:3000/"
  , chart;

var ignore = ["--", ">>", ""]

var ChartTranscript = Transcript.extend({
	// extend the basic Transcript to handle `word` events
	// and store a list of words
	defaults: {
		body: "",
		start: new Date(),
		words: []
	},

	handleWord: function(word) {
		// push new words to `line`
		this.attributes.words.push(word);
		this.trigger('change:words', this, this.get('words'), {});
	}
});

var ChartView = Backbone.View.extend({

	initialize: function(options) {
		_.bindAll(this);
		this.model = new ChartTranscript();
		this.model.on('change:words', this.updateWords, this);
	},

	updateWords: function(model, words, options) {
		// update the chart
		var counts = this.counts = _.reduce(words, function(memo, word) {
			if (!_.contains(ignore, word)) {
				memo[word] ? memo[word]++ : memo[word] = 1;
			}
			return memo;
		}, {});
		var chart = this.chart = d3.select(this.el)
		    .data(_.pairs(counts), function(d) { return d[0]; });
	}
});

var chart = new ChartView({ el: '#chart' });

</script>