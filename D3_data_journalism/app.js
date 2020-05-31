//General Layout dimensions for all graphs
// Define SVG area dimensions
var svgWidth = 500;
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

//--------------------------///
//create functions to simplify process & display code nicely:
// 1. healthcare v poverty//
function healthcareVSpoverty(){
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
}
//--------------------------///
// 2. smokers v age(x)//
function smokerVSage(){
    //Set SVG element with d3 within the html body (width and height attributes included)
    // Select body, append SVG area to it, and set its dimensions
    var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    ////Add a group area within the svg and set margins to top left of group
    // Append a group area, then set its margins
    var chartGroup= svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // read csv data
    d3.csv("data.csv").then(function(dataOutcomes){
        
        dataOutcomes.forEach(function(data) {
            data.smokes = +data.smokes;
            data.age = +data.age;
            });

        var x= d3.scaleLinear()
        .domain([25, d3.max(dataOutcomes, d => d.age)])
        .range([0, chartWidth]);
        
        var y = d3.scaleLinear()
        .domain([5, d3.max(dataOutcomes, d => d.smokes)+3])
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
        //.attr("transform", function(d){return `translate(${d.poverty},${d.healthcare}`})
    
        // Configure a plot function to plot scatter points 
        var circlePlot= circles
        .append("circle")
        .attr("class", "dot")
            .attr("cx", d=> x(d.age))
            .attr("cy", d=> y(d.smokes))
            .attr("r", 9)
            .attr("opacity", .5)
            .style("stroke", "red")
            .style("fill", "#69b3a2");
        
        //Create text for each circle group
        circles.append("text")
        .attr("dx", d=>x(d.age))
        .attr("dy", d=>y(d.smokes)+2.5)
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
            .text("Age vs Smokers");
        
        chartGroup.append("text")
            .attr("y", 0-(margin.left / 2))
            .attr("transform", `translate(0, ${chartHeight/2}) rotate(-90)`)
            .attr("text-anchor", "middle")  
            .style("font-size", "14px") 
            .text("Smokers (%)");
        
        chartGroup.append("text")
            .attr("x", (chartWidth / 2))             
            .attr("y", (chartHeight+margin.bottom/2))
            .attr("text-anchor", "middle")  
            .style("font-size", "14px") 
            .text("Age (Median)");
        
            // add tool tip
        // Step 1: Append tooltip div
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .html(function(d) {
                return (`<p class='font-weight-bold'>${d.state}: </p>
                <p>Smokers: % ${(d.smokes)}<br> Age: ${(d.age)}</p>`);
            });
        // // Step 2: Create the tooltip in chartGroup.
        circlePlot.call(toolTip);
    
        // // Step 3: Create "mouseover" event listener to display tooltip
        circles.on("mouseover", function(d) {
            toolTip.style("cursor", "cell");
            toolTip.show(d, this);
            })
        // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function(d) {
            toolTip.style("cursor", "default");
            toolTip.hide(d);
            })
    
        }).catch(function(error) {
            console.log(error)});;

}
// 3. Obesity v poverty//
function obesityVSpoverty(){
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
        console.log(dataOutcomes);
        //Type cast data for variables needed in scatter (poverty, healthcate, smokes, age)
        dataOutcomes.forEach(function(data) {
            data.poverty = +data.poverty;
            data.obesity = +data.obesity;
            });
        
            
            // Create a linear scale for the horizontal/vertical axis.
            var x= d3.scaleLinear()
            .domain([0, d3.max(dataOutcomes, d => d.poverty)+1])
            .range([0, chartWidth]);
            
            var y = d3.scaleLinear()
            .domain([0, d3.max(dataOutcomes, d => d.obesity)+2])
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
                .attr("cy", d=> y(d.obesity))
                .attr("r", 9)
                .attr("opacity", .5)
                .style("stroke", "red")
                .style("fill", "#69b3a2");
            
            //Create text for each circle group
            circles.append("text")
            .attr("dx", d=>x(d.poverty))
            .attr("dy", d=>y(d.obesity)+2.5)
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
                .text("Obesity vs Poverty");
            
            chartGroup.append("text")
                .attr("y", 0-(margin.left / 2))
                .attr("transform", `translate(0, ${chartHeight/2}) rotate(-90)`)
                .attr("text-anchor", "middle")  
                .style("font-size", "14px") 
                .text("Obesity (%)");
            
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
                <p>Obesity: % ${(d.obesity)}<br> Poverty: ${(d.poverty)}</p>`);
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
}

// 4. Smokes v poverty//
function smokesVSpoverty(){
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
        console.log(dataOutcomes);
        //Type cast data for variables needed in scatter (poverty, healthcate, smokes, age)
        dataOutcomes.forEach(function(data) {
            data.poverty = +data.poverty;
            data.smokes = +data.smokes;
            });
        
            // Create a linear scale for the horizontal/vertical axis.
            var x= d3.scaleLinear()
            .domain([0, d3.max(dataOutcomes, d => d.poverty)+1])
            .range([0, chartWidth]);
            
            var y = d3.scaleLinear()
            .domain([0, d3.max(dataOutcomes, d => d.smokes)+2])
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
                .attr("cy", d=> y(d.smokes))
                .attr("r", 9)
                .attr("opacity", .5)
                .style("stroke", "red")
                .style("fill", "#69b3a2");
            
            //Create text for each circle group
            circles.append("text")
            .attr("dx", d=>x(d.poverty))
            .attr("dy", d=>y(d.smokes)+2.5)
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
                .text("Smokes vs Poverty");
            
            chartGroup.append("text")
                .attr("y", 0-(margin.left / 2))
                .attr("transform", `translate(0, ${chartHeight/2}) rotate(-90)`)
                .attr("text-anchor", "middle")  
                .style("font-size", "14px") 
                .text("Smokes (%)");
            
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
                <p>Smokers: % ${(d.smokes)}<br> Poverty: ${(d.poverty)}</p>`);
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
}

healthcareVSpoverty();
smokerVSage();
obesityVSpoverty();
smokesVSpoverty();
    
