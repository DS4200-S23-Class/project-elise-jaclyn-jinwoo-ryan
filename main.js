let map;

window.initMap = function() {
    map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 34.45, lng: -119.7 },
            zoom: 12,
    })
};

window.initMap = initMap


const frame_height = 500;
const frame_width = 700;
const margins = {left: 34, right: 30, top: 30, bottom: 30};

// Functions to make the coordinates viable for graphing 
function transform_lon(coord) {
    return - (coord + 119) * 10
}

function transform_lat(coord) {
    return (coord - 34) * 10
}


//Scatterplot frame
const FRAME1 =
d3.select("#map")
    .append("svg")
        .attr("height", frame_height)
        .attr("width", frame_width)
        .attr("class", "frame")
    

d3.csv("data/yelp_business_clean.csv").then((data) => {
    console.log(data)

    // Creates the x scale
    const MAX_X = d3.max(data, (d) => {return transform_lat(parseFloat(d.latitude));});
    const X_SCALE = d3.scaleLinear()
        .domain([3.8, MAX_X + .1])
        .range([3.8, frame_width - margins.left - margins.right]);

    // Creates the y scale
    const MAX_Y = d3.max(data, (d) => {return transform_lon(parseFloat(d.longitude));});
    const Y_SCALE = d3.scaleLinear()
        .domain([5.8, MAX_Y + .1])
        .range([frame_height - margins.top - margins.bottom, 5.8]);

    //Generates the x axis
    xAxis = FRAME1.append("g")
        .attr("transform", "translate(" + margins.left +
            "," + (frame_height - margins.bottom) + ")")
        .call(d3.axisBottom(X_SCALE).ticks(5))
            .attr("font-size", '18px');

    //Generates the y axis
    yAxis = FRAME1.append("g")
    .attr("transform", "translate(" + margins.left +
        "," + margins.top + ")")
    .call(d3.axisLeft().scale(Y_SCALE).ticks(10))
        .attr("font-size", "18px");

    //Adds a title to the graph
    FRAME1.append("text")
        .attr("x", ((frame_width/3)))
        .attr("y", (margins.top))
        .text("Restaurant Locations")
        .attr("class", "title");

    // Add a clipPath: everything out of this area won't be drawn.
    let clip = FRAME1.append("defs").append("SVG:clipPath")
        .attr("id", "clip")
        .append("SVG:rect")
        .attr("width", frame_width - margins.right - margins.left)
        .attr("height", frame_height  - margins.bottom - margins.top)
        .attr("x", 0 + margins.left)
        .attr("y", 0 + margins.top);

    // Create the scatter variable: where both the circles and the brush take place
    let scatter = FRAME1.append('g')
        .attr("clip-path", "url(#clip)")

    //Generates all points in the csv
    scatter
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", (d) => { return (X_SCALE(transform_lat(parseFloat(d.latitude))) + margins.left); })
            .attr("cy", (d) => { return (Y_SCALE(transform_lon(parseFloat(d.longitude))) + margins.top); })
            .attr("r", 5)
            .attr("fill", "blue")
            //.attr("class", (d) => {return "pointone " + d.Species})
            //.attr("id", (d) => {return "one" + d.id});


    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    let zoom = d3.zoom()
        .scaleExtent([.5, 20])
        .extent([[0, 0], [frame_width, frame_height]])
        .on("zoom", updateChart);

    // Adds an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    FRAME1.append("rect")
        .attr("width", frame_width)
        .attr("height", frame_height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')
        .call(zoom);

    // A function that updates the chart when the user zoom and thus new boundaries are available
    function updateChart() {

        // recover the new scale
        let newX = d3.event.transform.rescaleX(X_SCALE);
        let newY = d3.event.transform.rescaleY(Y_SCALE);

        // update axes with these new boundaries
        xAxis.call(d3.axisBottom(newX))
        yAxis.call(d3.axisLeft(newY))

        // update circle position
        scatter
            .selectAll("circle")
            .attr('cx', function(d) {return newX(transform_lat(parseFloat(d.latitude)))})
            .attr('cy', function(d) {return newY(transform_lon(parseFloat(d.longitude)))});
    }

});

/*
// left column

// Create list of points
let points = document.getElementsByTagName("circle");

// loop to make second click unavaible 
for (let i = 0; i < points.length; i++) {
    
    // check each point for clicks
    let point = points[i];
    point.addEventListener("click", function(){

                  // click then add border
                  this.classList.toggle("Border");

                  //find the cx and cy
                  let cx = this.getAttribute("cx") / 50;
                  let cy = (500 - this.getAttribute("cy")) / 50;

                  // create new text
                  let text1 = "Last point clicked: "
                  let text2 = "(" + cx +"," + cy + ")"
  
                  // show the text information
                  document.getElementById("text1").innerHTML = text1;
                  document.getElementById("text2").innerHTML = text2;
}
)}


// right column

// connect botton to the reaction
let pointButton =  document.getElementById("subButton");
pointButton.addEventListener("click", function(){

    // 1. locate to the html file first to get the input
    // 2. then transfer value which would show on the graph
    // 3. Identify the same frame
    // 4. continue what we did to the left column

    // get the user's input
    let xInput = document.getElementById("cx1");
    let yInput = document.getElementById("cy1");


    // get the values from the user selections
    let cx1 = xInput.value;
    let cy1 = yInput.value;

    // convert value to 50base to the graph
    let x = cx1 * 50;
    let y = 500 - (cy1 * 50);

    // using the same frame with the graph
    let frame = document.getElementById("frame");

    // add a circle to the html
    let circleStr = '<circle cx="' + x + '" cy="' + y + '" r="10"/>';
    frame.innerHTML += circleStr;

    let points = document.getElementsByTagName("circle");

    // loop through all points
    for (let i = 0; i < points.length; i++) {
        
        // check each point for clicks
        let point = points[i];
        point.addEventListener("click", function(){

                  // click then add border
                  this.classList.toggle("Border");

                  //find the cx and cy
                  let cx = this.getAttribute("cx") / 50;
                  let cy = (500 - this.getAttribute("cy")) / 50;

                  // create new text
                  let text1 = "Last point clicked: "
                  let text2 = "(" + cx +"," + cy + ")"
  
                  // show the text information
                  document.getElementById("text1").innerHTML = text1;
                  document.getElementById("text2").innerHTML = text2;

    })}
    }
    )

    */