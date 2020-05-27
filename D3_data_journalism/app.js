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
d3.csv("data.csv").then(function(dataOutcomes){
    console.log(dataOutcomes);
    
    //Type cast data for variables needed in scatter (poverty, healthcate, smokes, age)
    dataOutcomes.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.obesity = +data.obesity;
        });
    
        // Create a linear scale for the horizontal/vertical axis.
        // 1. healthcare v poverty
        var xLinearPoverty = d3.scaleLinear()
        .domain([0, d3.max(dataOutcomes, d => d.poverty)])
        .range([chartHeight, 0]);
        var yLinearHealthcare = d3.scaleLinear()
        .domain([0, d3.max(dataOutcomes, d => d.healthcare)])
        .range([chartHeight, 0]);


}).catch(function(error) {
    console.log(error);
})