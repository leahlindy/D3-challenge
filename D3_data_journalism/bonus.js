// Flow through data: first need initial plot to display
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#data_select");
  
    // main function / default view:
    
    //Set SVG element with d3 within the html body (width and height attributes included)
    // Select body, append SVG area to it, and set its dimensions
    var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    
    // Append a group area, then set its margins
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    //Load the data with d3.csv from data.csv file
    d3.csv("data.csv").then(function(dataOutcomes){
        
        //Type cast data for variables needed in scatter (poverty, healthcate, smokes, age)
        dataOutcomes.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            });
            
            // Create a linear scale for the horizontal/vertical axis.
            var x= d3.scaleLinear()
            .domain([8, d3.max(dataOutcomes, d => d.poverty)+1])
            .range([0, chartWidth]);
            
            var y = d3.scaleLinear()
            .domain([0, d3.max(dataOutcomes, d => d.healthcare)+2])
            .range([chartHeight, 0]);
        
            // Create two new functions passing our scales in as arguments
            // These will be used to create the chart's axes
            var bottomAxis = d3.axisBottom(x);
            var leftAxis = d3.axisLeft(y);
        
            // append the axis to chart:
            chartGroup.append("g")
            .call(leftAxis);
        
            chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);
        
            // Create and place the "blocks" to hold the circles and text 
            var circles = chartGroup.selectAll("g")
            .data(dataOutcomes)
            .enter()
            .append("g");
            // .attr("transform", function(d){return `translate(${d.poverty},${d.healthcare}`})
        
            // Configure a plot function to plot scatter points 
            var circlePlot= circles
            .append("circle")
            .attr("class", "dot")
                .attr("cx", d=> x(d.poverty))
                .attr("cy", d=> y(d.healthcare))
                .attr("r", 9)
                .attr("opacity", .5)
                .style("stroke", "red")
                .style("fill", "#69b3a2");
            
            //Create text for each circle group
            circles.append("text")
            .attr("dx", d=>x(d.poverty))
            .attr("dy", d=>y(d.healthcare)+2.5)
            .attr("text-anchor", "middle") 
            .style("font-size", "10px") 
            .style("fill", "black")
            .text(d=>d.abbr);
        
            // add title/labels to chart
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
                .text("Lacks Healthcare (%)");
            
            chartGroup.append("text")
                .attr("x", (chartWidth / 2))             
                .attr("y", (chartHeight+margin.bottom/2))
                .attr("text-anchor", "middle")  
                .style("font-size", "14px") 
                .text("In Poverty (%)");
            
            // Step 1: Append tooltip div
            var toolTip1 = d3.tip()
            .attr("class", "d3-tip")
            .html(function(d) {
                return (`<p class='font-weight-bold'>${d.state}: </p>
                <p>Lack Healthcare: % ${(d.healthcare)}<br> Poverty: ${(d.poverty)}</p>`);
            });
            // Step 2: Create the tooltip in chartGroup.
            circlePlot.call(toolTip1);
        
            // Step 3: Create "mouseover" event listener to display tooltip
            circles.on("mouseover", function(d) {
                toolTip1.style("cursor", "cell");
                toolTip1.show(d, this);
                })
            // Step 4: Create "mouseout" event listener to hide tooltip
                .on("mouseout", function(d) {
                    toolTip1.style("cursor", "default");
                    toolTip1.hide(d);
                    }) 
            }).catch(function(error) {
                console.log(error)});
            
    getData();
    updateGraph();
    }

// Step 2: get DOM change to call the getData function (form id=data_select)
d3.selectAll("#data_select").on("change", getData);
var scatter = d3.selectAll("#scatter").node();

// Function called by DOM changes
function getData() {
  var dropdownMenu = d3.select("#data_select");
  // Assign the value of the dropdown menu option to a variable
  var dataset = dropdownMenu.property("value");
  var data =[];
  
// input names for the data you have
  if (dataset == 'Healthcare vs Poverty') {
    data = healthcareVSpoverty();
  }
  else if (dataset == 'Smokers vs Age') {
    data = smokerVSage();
  }
  else if (dataset == 'Obesity vs Poverty') {
    data = obesityVSpoverty();
  }
  else if (dataset == 'Smokers vs Poverty') {
    data = smokesVSpoverty();
    }

}
// Update the restyled plot's values
function updateGraph() {
    data[0];
  }
  
init();