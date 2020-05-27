// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;
// Define the chart's margins as an object
var margin = {
top: 60,
right: 60,
bottom: 60,
left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

//Set SVG element with d3 within the html body (width and height attributes included)
// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("body")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

////Add a group area within the svg and set margins to top left of group
// Append a group area, then set its margins
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

//Load the data with d3.csv from data.csv file
d3.csv("data.csv").then(function(data){
    console.log(data);
}).catch(function(error) {
    console.log(error);
})