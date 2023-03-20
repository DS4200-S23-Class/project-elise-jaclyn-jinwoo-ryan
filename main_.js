// Things must stay in the initMap Function or they may not run correctly (Google is weird)
window.initMap = function() {
	// Create the Google Map…
	let map = new google.maps.Map(d3.select("#map").node(), {
		zoom: 13,
		center: new google.maps.LatLng(34.43, -119.7),
	});


	// Create the markers
	d3.csv("data/yelp_business_clean.csv", function(data) {

		// Reference link: https://developers.google.com/maps/documentation/javascript/markers#animate
		// Creates the markers
		let marker = new google.maps.Marker({
			map,
			position: { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) },
			title: data.stars
		});

		// Adds a listener to each marker
		marker.addListener("click", () => {
      		console.log(data)
    	});
	});

};

const frame_height = 500;
const frame_width = 350;
const margins = {left: 34, right: 30, top: 30, bottom: 30};
const review_color = {"1 star": "#E92E1F", "2 star": "#E9931F", "3 star": "#DAE91F", "4 star": "#75E91F", "5 star": "#1FE92E"};

const FRAME2 =
d3.select("#vis2")
    .append("svg")
        .attr("height", frame_height)
        .attr("width", frame_width)
        .attr("class", "frame");

//bar chart time
d3.csv("data/yelp_business_clean.csv").then((data) => {

//for later to iterate colors through hard coded bar qty
    colors = d3.scaleOrdinal(Object.values(review_color));

    const y_scale =
    d3.scaleLinear()
        .domain([0, (100)])
        .range([(frame_height - margins.bottom), 0]);

    const x_scale =
    d3.scaleBand()
        .domain(Object.keys(review_color))
        .range([0, (frame_width - margins.right), 0]);

    FRAME2.append("g")
        .attr("transform", "translate(" + margins.left + ")")
        .call(
            d3.axisLeft()
                .scale(y_scale)
                .ticks(10)
           )
            .attr("font-size", "20px");

    FRAME2.append("g")
        .attr("transform", "translate(" + margins.left + "," + (frame_height - margins.bottom) + ")")
        .call(
            d3.axisBottom()
                .scale(x_scale)
                .ticks(10)
            );

    Object.entries(review_color).forEach(entry => {
        const [key, value] = entry;
            FRAME2.append("rect")
                .attr("transform", "translate(" + margins.left +  ")")
                .attr("x", (x_scale(key)))
                .attr("y", (y_scale(50)))
                .attr("height", ( frame_height - y_scale(50) - margins.bottom))
                .attr("width", x_scale.bandwidth() - 5)
                .attr("class", "bar")
                .attr("id", key);
    });

    FRAME2.selectAll(".bar")
        .attr("fill", (d,i) => {return colors(i)});

    FRAME2.append("text")
        .attr("x", ((frame_width/2) - (margins.right/2)))
        .attr("y", (margins.top))
        .text("Reviews")
        .attr("class", "title");

    const tooltip =
    d3.select("#vis2")
        .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

    function handleMouseover(event, d) {
        tooltip.style("opacity", 1);
    }

    function handleMousemove(event, d) {
        tooltip.html("Most Recent Review of this Rating: MM/DD/YY")
            .style("left", (d.pageX + 10) + "px")
            .style("top", (d.pageY + 50) + "px");
    }

    function handleMouseleave(event, d) {
        tooltip.style("opacity", 0);
    }

    FRAME2.selectAll(".bar")
        .on("mouseover", handleMouseover)
        .on("mousemove", handleMousemove)
        .on("mouseleave", handleMouseleave);

});


