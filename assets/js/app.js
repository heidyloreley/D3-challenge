function makeResponsive() {


    var svgArea = d3.select("#scatter").select("svg");

    // Clear svg area if not empty
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // //All information resize by browser size
    // var svgWidth = window.innerWidth;
    // var svgHeight = window.innerHeight;

    //SVG Canvas dimensions resize by browser size
    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {
        top: 40,
        bottom: 80,
        right: 50,
        left: 50
    };

    // Define graph area size
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgHeight - margin.left - margin.right;

    // Append SVG element  
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append group element
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Read CSV data and obtain information to graph
    d3.csv("./assets/data/data.csv").then(function (healthData) {
        console.log(healthData);

        // Parse data
        healthData.forEach(data => {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
        });

        // Create Scales
        var xLinearScale = d3.scaleLinear()
            .domain([0, d3.max(healthData, d => d.poverty)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(healthData, d => d.healthcare)])
            .range([height, 0]);

        //Create circles and include States Abbreviation inside them
        var circlesGroup = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .classed("stateCircle", true) //  includes fill and stroke
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", 10)
            .attr("text", d => d.abbr)
            .attr("stroke-width", "1");
        // console.log(circlesGroup);

        var circlesText = chartGroup.selectAll("text")
            .data(healthData)
            .enter()
            .append("text")
            .classed("stateText", true)
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcare))
            .attr("font-size", "10px")
            .text(function (d) {
                // console.log(d.abbr);
                return `${d.abbr}`;
            });
        // console.log(circlesText);


        // Create and append Axis 
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale);

        chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);
        chartGroup.append("g").call(yAxis);

        // Include Axis Titles
        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + 50})`)
            .attr("fill", "black")
            .classed("aText", true)
            .text("In Poverty (%)");

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - (margin.left / 2))
            .attr("x", 0 - (height / 2))
            .attr("fill", "black")
            .classed("aText", true)
            .text("Lacks Healthcare (%)");

    }).catch(function (error) {
        console.log(error);
    });

};

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);