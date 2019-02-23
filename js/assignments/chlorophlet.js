var dataUrl =
"https://emotional-apps.com/apis/meit/stats/getdata.php?test=1&gender=all&age=all&begindate=2000-01-01&enddate=2018-02-04";
var countryUrl =
"https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

// Width and height
var w = 960;
var h = 500;
var dataDict;

var color = d3.scale
.quantize()
.range([
  "rgb(237,248,233)",
  "rgb(186,228,179)",
  "rgb(116,196,118)",
  "rgb(49,163,84)",
  "rgb(0,109,44)"
]);

// Define map projection
var projection = d3.geo.equirectangular();

// Define path generator
var path = d3.geo.path().projection(projection);

// Create SVG element
var svg = d3
.select("#chlorophlet")
.append("svg")
.attr("width", w)
.attr("height", h);

// Get the data
d3.json(dataUrl, function(data) {
// Construct data structure to store the data.
dataDict = {};
for (var i = 0; i < data.length; i++) {
  dataDict[data[i]["iso3"]] = parseFloat(data[i]["score_average"]);
}
color.domain([
  d3.min(d3.values(dataDict)),
  d3.max(d3.values(dataDict))
]);
console.log(dataDict);
// Load in GeoJSON data
d3.json(countryUrl, function(json) {
  // Bind data and create one path per GeoJSON feature
  svg
    .selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", function(d) {
      var countryID = d.id;
      var value = dataDict[countryID];
      return color(value);
    });
});
});