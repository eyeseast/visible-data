---
title: Partisanship Over 111 Senates
layout: post
published: true
comments: true
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

Following up on my post about partisanship in the 111th US Senate, I wanted to look at how alliances have shifted over the history of Congress. Use the buttons below or the left and right arrow keys to move back and forward through Congresses, and you'll see parties and legislators move across the political spectrum.

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

This is the same [DW-Nominate](http://voteview.com/dwnominate.asp) data from [Voteview](http://voteview.com). In this chart, the X axis is the First Dimension score, and "can be interpreted in most periods as government intervention in the economy or liberal-conservative in the modern era." The Second Dimension, on the Y axis here, "picks up the conflict between North and South on Slavery before the Civil War and from the late 1930s through the mid-1970s, civil rights for African-Americans." (Note that I've flipped the Y axis here, so Southern Democrats and similar parties appear in the lower part of the graph.)

Also, there are a ton of minor parties. I have a degree in politics and I'd never heard of most of them. Colors are grouped where it seemed reasonable (various forms of Democrats are blue; Republicans are red).

What do you see in the data?

<script type="text/javascript" src="/visible-data/js/senate-dwn-1-111.js"> </script>