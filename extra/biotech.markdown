---
title: Biotech in New England
layout: post
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

rect.company {
	stroke: #ddd;
	shape-rendering: crispEdges;
}
</style>

<div id="charts">
	<iframe width="900" height="300" scrolling="no" frameborder="no" src="https://www.google.com/fusiontables/embedviz?viz=MAP&amp;q=select+col6+from+1iPKGfiM4OgbthyQcI-Erm6GZ0wOilT9x_iHhGzA&amp;h=false&amp;lat=41.80407814427234&amp;lng=-72.49877929687506&amp;z=6&amp;t=1&amp;l=col6"> </iframe>

	<div id="city-spectrum"> </div>
</div>

Project log:

Given two datasets on biotech companies from a trade group, the following is my hunt for story ideas in the data.

Starting points:
 - reconcile two lists of companies into one master list
 - geocode all addresses (might need fusion tables for this)
 - how many companies per state?
 - how many companies per city?
 - are zip codes interesting?
 - are there obvious clusters of companies? (map points to see clusters of companies)
 - filter out companies with zero employees (unknown, not actually zero) and map proportional bubbles by number of employees. Are there clusters of employees, and does this look different from clustering by address?

More substantive questions:
 - Are companies and employees clustered in an obvious way, around universities or in enterprise zones?
 - Are states or cities actively competing for companies? If so, how?
 - Do states and cities have an incentive to coordinate efforts, so they don't directly compete? (for example, luring one subset of biotech firms to Massachusetts, with others clustered in Connecticut)
 - How many companies have moved in the last decade? (guessing this is a small number)
 - How many employees have companies added in the last decade? And how many gained/lost since the recession?

Reconciling the two datasets is hard, especially given that one is upper case and the other is title case, and that slight differences in punctuation or spelling or spacing will make simple text matching fail. SQL is the answer here.

I built a quick Django app to make loading and normalizing the data easier. I imported the data, which clearly has duplicates, but this goes a long way toward getting everything in one place. I exported the combined dataset to CSV, then ran that through Google Refine to clean up addresses. Finally, I opened the file as a spreadsheet and deleted obvious duplicates by hand. Final list of companies is [here](https://docs.google.com/spreadsheet/ccc?key=0AprNP7zjIYS1dEV3TjEyVEFmSThyY2owM2RLSXhnaFE). Time to geocode.

Or not. For some reason, I can't get Google to geocode this outside of Fusion Tables, and the documented Google Maps API no longer matches the actual API (I've been using Leaflet and TileMill for months now).

But, just from the Fusion Tables map embedded above, I can see that there's an obvious concentration of companies headquaretered in Cambridge, and a general cluster in New England. This may be biased by the source data, coming from MassBio.

What I want to know now is whether certain types of companies are concentrated in certain cities.

To do this, I'm going to create a stacked bar chart. Each box represents a company; each row is a city in Massachusetts. I'm limiting myself to one state, both for clarity and to test this format.

The chart above is built in D3 ([code here](https://gist.github.com/66abb93b877cb466a826)). Hopefully, it shows the concentration of biotech companies in Cambridge, as well as the dominance of drug manufacturers.

If geocoding had worked (or the Fusion Tables API had worked as documented), I'd have color-coded the map the same way.

Depending on the long-term commitment to covering biotech in depth, I'd look at ways to partner with trade groups to create a public directory and wiki of biotech companies, essentially CrunchBase for biotech.

<script type="text/javascript" src="/visible-data/js/biotech.js">
</script>
