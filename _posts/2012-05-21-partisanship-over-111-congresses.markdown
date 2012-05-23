---
title: Partisanship Over 111 Senates
layout: post
published: true
tags: [d3, underscore, crossfilter]

scripts:
 - http://d3js.org/d3.v2.min.js
 - http://documentcloud.github.com/underscore/underscore-min.js
 - https://raw.github.com/square/crossfilter/master/crossfilter.min.js
 - /visible-data/js/parties.js
 - http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js

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

Following up on my post about partisanship in the 111th US Senate, I wanted to look at how alliances have shifted over the history of Congress.

<div id="chart-wrapper" class="row">
	<div id="chart"> </div>
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
	<form class="form-horizontal" id="congress">
		<div class="row">
			<div class="span3">
				<label>Year: </label>
				<input name="year" class="span2" 
					type="number" value="2010" 
					max="2010"
					min="1789" />
			</div>
			<div class="span2">
				<label>Congress #:</label>
				<input name="congress" class="span2" 
					type="number" value="111" 
					max="111"
					min="1" />
			</div>
		</div>
	</form>
</div>

What does this mean?

<script type="text/javascript" src="/visible-data/js/senate-dwn-1-111.js"> </script>