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

console.log(margin.left);
console.log(chartHeight);
//Set SVG element with d3 within the html body (width and height attributes included)
// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
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
    var x= d3.scaleLinear()
    .domain([0, d3.max(dataOutcomes, d => d.poverty)])
    .range([0, chartWidth]);
    
    var y = d3.scaleLinear()
    .domain([0, d3.max(dataOutcomes, d => d.healthcare)])
    .range([chartHeight+1, 0]);

    // Create two new functions passing our scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(x);
    var leftAxis = d3.axisLeft(y);
    
    console.log(x);

    // append the axis to chart:
    chartGroup.append("g")
    .call(leftAxis);

    chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

    // Configure a plot function to plot scatter points 
    chartGroup.append('g')
    .selectAll("dot")
    .data(dataOutcomes)
    .enter()
    .append("circle")
    .attr("class", "dot")
      .attr("cx", d=> x(d.poverty))
      .attr("cy", d=> y(d.healthcare))
      .attr("r", 3)
      .style("fill", "#69b3a2");
    
    // add title/labels
    chartGroup.append("text")
        .attr("x", (chartWidth / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Healthcare vs Poverty");
    
    chartGroup.append("text")
        .attr("y", 0-(margin.left / 2))
        .attr("transform", `translate(0, ${chartHeight/2}) rotate(-90)`)
        .attr("text-anchor", "middle")  
        .style("font-size", "14px") 
        .text("Healthcare (%)");
    chartGroup.append("text")
        .attr("x", (chartWidth / 2))             
        .attr("y", (chartHeight+margin.bottom/2))
        .attr("text-anchor", "middle")  
        .style("font-size", "14px") 
        .text("Poverty (%)");
    


}).catch(function(error) {
    console.log(error);
})