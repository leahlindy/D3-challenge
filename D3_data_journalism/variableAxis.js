//General Layout dimensions for all graphs
// Define SVG area dimensions
var svgWidth = 500;
var svgHeight = 500;
// Define the chart's margins as an object
var margin = {
top: 80,
right: 40,
bottom: 80,
left: 100
};
// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg:svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    
// Append a group area, then set its margins
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initial graph parameters 
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create x-axis scale
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * .5 ,
      d3.max(data, d => d[chosenXAxis] * 1.1)
    ])
    .range([0, chartWidth]);

  return xLinearScale;

}

function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * 0.7,
        d3.max(data, d => d[chosenYAxis]) * 1.1])
      .range([chartHeight,0]);
  
    return yLinearScale;
  
  }
  // function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }
  // function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

return circlesGroup;
}
// Function to update text in circles 
function renderCirclesTextGroup(circlesTextGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circlesTextGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
    
    return circlesTextGroup;
}
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var xLabel;
    var yLabel;
    //Update X-axis:
    if (chosenXAxis === "poverty") {
        xLabel = "Poverty: %";
    }
    else if (chosenXAxis === "age"){
        xLabel = "Median Age: ";
    }
    //Update Y-aixs:
    if (chosenYAxis === "smokes"){
        yLabel = "Smokers: %"
        }
    else if (chosenYAxis === "healthcare"){
        yLabel = "Lack Healthcare: %"
        }
    else {
        yLabel = "Obesity: %"
        }
    //Update tool tip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .html(function(d) {
        return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<br> ${yLabel}${d[chosenYAxis]}`);
      });

    circlesGroup.call(toolTip);

    // onmouseout event
    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d);
    })
      // onmouseout event
      .on("mouseout", function(d) {
        toolTip.hide(d);
      });
  
    return circlesGroup;
  }

//Load the data with d3.csv from data.csv file
d3.csv("data.csv").then(function(data, err){
    if (err) throw err;

    //Type cast data for variables needed in scatter (poverty, healthcate, smokes, age)
    data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.age = +data.age;
        });
        
    // Create a linear scale for the horizontal/vertical axis.- with functions created
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);

    // Create two new functions passing our scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);
  
    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // Create and place the "blocks" to hold the circles and text 
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("opacity", .5)
        .style("stroke", "red")
        .style("fill", "#69b3a2")
        .classed("circle-state", true);
    
    // Appending state abbreviations to circles
    var circlesTextGroup = chartGroup.append("text").classed("text-state",true)
        .selectAll("tspan")
        .data(data)
        .enter()
        .append("tspan")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .text(d => d.abbr)
        .style('font-size', 8)
        .attr("dy", 3);

    //Create group for various x labels:
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`); //offset by 20
    
    
    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Population in Poverty (%)");
    
    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40) //offset label by 20 from poverty label
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Median Age");
    
    //Create group for various y labels:
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `rotate(-90)`);
    
    var healthcareLabel = yLabelsGroup.append("text")
        .attr("y", 0 - 50) //right margin is still 60 (change left to 100 for more space)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true) 
        .text("Lack Healthcare (%)");
    
    var smokersLabel = yLabelsGroup.append("text")
        .attr("y", 0 - 70)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true) 
        .text("Smokers (%)");

    var obesityLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .attr("value", "obesity") 
        .classed("inactive", true) // value to grab for event listener
        .text("Obesity (%)");

    /// function to updateToolTip for both, the circles and their text
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    circlesTextGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesTextGroup);
  
    // x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            console.log(chosenXAxis)

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(data, chosenXAxis);

            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

            // updates circles text to their new positions
            circlesTextGroup = renderCirclesTextGroup(circlesTextGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
    
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
            circlesTextGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesTextGroup);
    

            // changes classes to change bold text
            if (chosenXAxis === "poverty") {
                povertyLabel
                .classed("active", true)
                .classed("inactive", false);
                ageLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenXAxis === "age"){
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
                ageLabel
                .classed("active", true)
                .classed("inactive", false);
                }
            }

    });
    // y axis labels event listener
    yLabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

            // replaces chosenXAxis with value
            chosenYAxis = value;

            console.log(chosenYAxis)

            // functions here found above csv import
            // updates x scale for new data
            yLinearScale = yScale(data, chosenYAxis);

            // updates x axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

            // updates circles with new y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

            // updates circles text to their new positions
            circlesTextGroup = renderCirclesTextGroup(circlesTextGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circlesTextGroup);
            circlesTextGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesTextGroup);


            // changes classes to change bold text
            if (chosenYAxis === "healthcare") {
                healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
                smokersLabel
                .classed("active", false)
                .classed("inactive", true);
                obesityLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenYAxis === "smokes"){
                healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
                smokersLabel
                .classed("active", true)
                .classed("inactive", false);
                obesityLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenYAxis === "obesity"){
                healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
                smokersLabel
                .classed("active", false)
                .classed("inactive", true);
                obesityLabel
                .classed("active", true)
                .classed("inactive", false);
                }
            }

        
        })
}).catch(function(error) {
    console.log(error);
});