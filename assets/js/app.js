    // define SVG width
    var svgWidth = 1000;
    var svgHeight = 600;

    // define margins that will be used for Chart area
    var margin = {
        top: 20,
        right: 10,
        bottom: 100,
        left: 100
    };

    // Chart width and height
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;


    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select("#scatter")
        .append("svg")
        .classed("chart", true)
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Chartgroup 
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    //initial Parameters for Load
    var X = "poverty";
    var Y = "healthcare";

    // Variable Transition is used differentiate between  intial load Vs lables-on-click load 
    var Transition = "No";


    // Create X axes labels
    // ==============================

    var xLabels = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "aText");


    var PovertyLabel = xLabels.append("text")
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "poverty")
        .text("In poverty (%)");


    var AgeLabel = xLabels.append("text")
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age")
        .text("Age (Median)");

    var IncomeLabel = xLabels.append("text")
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income")
        .text("Household Income (Median)");

    // Create Y axes labels
    // ==============================

    var yLabels = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left + 40}, ${(height/2)})`)
        .attr("class", "aText");

    var Healtcarelabel = yLabels.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0)
        .attr("dy", "1em")
        .classed("active", true)
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)");

    var SmokesLabel = yLabels.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -20)
        .attr("x", 0)
        .attr("dy", "1em")
        .classed("inactive", true)
        .attr("value", "smokes")
        .text("Smokers (%)");

    var ObeseLabel = yLabels.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", 0)
        .attr("dy", "1em")
        .classed("inactive", true)
        .attr("value", "obesity")
        .text("Obesity (%)");



    // Call Scatterbuild function using initial parameters that creates the chart

    scatterbuild(X, Y);

    // Scatter build function definition
    function scatterbuild(X, Y) {

        // Import Data
        d3.csv("assets/data/data.csv").then(function(StatesGovData) {

            // Step 1: Parse Data/Cast as numbers
            // ==============================

            StatesGovData.forEach(function(data) {
                data.poverty = +data.poverty;
                data.healthcare = +data.healthcare;
                data.age = +data.age;
                data.obesity = +data.obesity;
                data.income = +data.income;
                data.smokes = +data.smokes;
            });

            // Step 2: Create scale functions
            // ==============================
            var xLinearScale = d3.scaleLinear()
                .domain([d3.min(StatesGovData, d => d[X]) * 0.75, d3.max(StatesGovData, d => d[X]) * 1.1])
                .range([0, width]);


            var yLinearScale = d3.scaleLinear()
                .domain([d3.min(StatesGovData, d => d[Y]) * 0.75, d3.max(StatesGovData, d => d[Y]) * 1.1])
                .range([height, 0]);

            // Step 3: Create axis functions
            // ==============================
            var bottomAxis = d3.axisBottom(xLinearScale);
            var leftAxis = d3.axisLeft(yLinearScale);


            // Step 4: Append Axes to the chart
            // ==============================
            var xaxis = chartGroup.selectAll(".xaxis")
                .data(StatesGovData);

            xaxis.enter()
                .append("g")
                .classed("xaxis", true)
                .merge(xaxis)
                .attr("transform", `translate(0, ${height})`)
                .transition().duration(500).call(bottomAxis);

            xaxis.exit().remove()

            var yaxis = chartGroup.selectAll(".yaxis")
                .data(StatesGovData);

            yaxis.enter()
                .append("g")
                .classed("yaxis", true)
                .merge(yaxis)
                .transition().duration(500).call(leftAxis);

            yaxis.exit().remove()

            // Step 5: Create Circles
            // ==============================

            if (Transition === "No") {
                var circlesGroup = chartGroup.selectAll("circle")
                    .data(StatesGovData);

                circlesGroup.enter()
                    .append("circle")
                    .classed("stateCircle", true)
                    .merge(circlesGroup)
                    .attr("cx", d => xLinearScale(d[X]))
                    .attr("cy", d => yLinearScale(d[Y]))
                    .attr("r", "12")
                    .attr("opacity", "0.75");

                circlesGroup.exit().remove();
            } else {
                var circlesGroup = chartGroup.selectAll("circle")
                    .data(StatesGovData);

                circlesGroup.enter()
                    .append("circle")
                    .classed("stateCircle", true)
                    .merge(circlesGroup)
                    .transition()
                    .duration(1000)
                    .attr("cx", d => xLinearScale(d[X]))
                    .attr("cy", d => yLinearScale(d[Y]))
                    .attr("r", "12")
                    .attr("opacity", "0.75");

                circlesGroup.exit().remove();
            }

            // Append text to circles 

            if (Transition === "No") {

                var Appendtext = chartGroup.selectAll(".stateText")
                    .data(StatesGovData);

                Appendtext.enter()
                    .append("text")
                    .classed("stateText", true)
                    .merge(Appendtext)
                    .attr("x", d => xLinearScale(d[X]))
                    .attr("y", d => yLinearScale(d[Y]))
                    .text(d => d.abbr)
                    .style("font-size", "11px");

                Appendtext.exit().remove();
            } else {
                var Appendtext = chartGroup.selectAll(".stateText")
                    .data(StatesGovData);

                Appendtext.enter()
                    .append("text")
                    .classed("stateText", true)
                    .merge(Appendtext)
                    .transition()
                    .duration(1000)
                    .attr("x", d => xLinearScale(d[X]))
                    .attr("y", d => yLinearScale(d[Y]))
                    .text(d => d.abbr)
                    .style("font-size", "10px");

                Appendtext.exit().remove();
            }


            // Step 6: Initialize tool tip
            // ==============================

            var toolTip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-20, 40])
                .html(function(d) {
                    return (`${d["state"]}<br>${X}: ${d[X]}<br>${Y}: ${d[Y]}`);
                });

            // Step 7: Create tooltip in the chart
            // ==============================

            chartGroup.call(toolTip);

            // Step 8: Create event listeners to display and hide the tooltip
            // ==============================

            chartGroup.selectAll(".stateText")
                .on("mouseover", function(data) {
                    toolTip.show(data, this);
                })
                // onmouseout event
                .on("mouseout", function(data) {
                    toolTip.hide(data);
                });


            xLabels.selectAll("text")
                .on("click", function() {
                    var xlabelvalue = d3.select(this).attr("value");

                    // Change the variable Transition from 'No' to 'Yes' after the first xlabel-on-click action
                    Transition = "Yes"

                    // Assign new parameter based on the clicked label
                    X = xlabelvalue;

                    // call scatterbuild function using the new X parameter
                    scatterbuild(X, Y)

                    //change classes to show which plot is active

                    if (X === "poverty") {
                        PovertyLabel.classed("active", true).classed("inactive", false);
                        AgeLabel.classed("active", false).classed("inactive", true);
                        IncomeLabel.classed("active", false).classed("inactive", true);
                    } else if (X === "age") {
                        PovertyLabel.classed("active", false).classed("inactive", true);
                        AgeLabel.classed("active", true).classed("inactive", false);
                        IncomeLabel.classed("active", false).classed("inactive", true);
                    } else {
                        PovertyLabel.classed("active", false).classed("inactive", true);
                        AgeLabel.classed("active", false).classed("inactive", true);
                        IncomeLabel.classed("active", true).classed("inactive", false);
                    }

                });

            yLabels.selectAll("text")
                .on("click", function() {
                    var ylabelvalue = d3.select(this).attr("value");

                    // Change the variable Transition from 'No' to 'Yes' after the first ylabel-on-click action
                    Transition = "Yes"

                    // Assign new parameter based on the clicked label
                    Y = ylabelvalue;

                    // call scatterbuild function using the new Y parameter
                    scatterbuild(X, Y)

                    if (Y === "healthcare") {
                        Healtcarelabel.classed("active", true).classed("inactive", false);
                        SmokesLabel.classed("active", false).classed("inactive", true);
                        ObeseLabel.classed("active", false).classed("inactive", true);
                    } else if (Y === "smokes") {
                        Healtcarelabel.classed("active", false).classed("inactive", true);
                        SmokesLabel.classed("active", true).classed("inactive", false);
                        ObeseLabel.classed("active", false).classed("inactive", true);
                    } else {
                        Healtcarelabel.classed("active", false).classed("inactive", true);
                        SmokesLabel.classed("active", false).classed("inactive", true);
                        ObeseLabel.classed("active", true).classed("inactive", false);
                    }

                });


        }).catch(function(error) {
            console.log(error);
        })
    };