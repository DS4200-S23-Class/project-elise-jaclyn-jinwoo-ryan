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
			title: data.name
		});

		// Adds a listener to each marker
		marker.addListener("click", () => {
			// Converts the date list to a dict
			dates = data.dates.split(", ");
			const date_counts = [(dates[0].replace('\'', '').replace('[', '').substr(0, 10)),
			    (dates[1].replace('\'', '').substr(0, 10)),
			    (dates[2].replace('\'', '').substr(0, 10)),
			    (dates[3].replace('\'', '').substr(0, 10)),
			    (dates[4].replace('\'', '').replace(']', '').substr(0, 10))];

			// Converts the star list to a dict
			stars = data.stars.split(", ");
			const star_counts = {"1 star": (parseInt(stars[0].substr(1))),
			    "2 star": (parseInt(stars[1])),
			    "3 star": (parseInt(stars[2])),
			    "4 star": (parseInt(stars[3])),
			    "5 star": (parseInt(stars[4].substr(0, stars[4].length - 1)))};
			
			load_bar(star_counts, date_counts)
		});
	});


	function handle_button() {
	lat = document.getElementById("lat_in").value
	lng = document.getElementById("long_in").value

	let center = new google.maps.LatLng(lat, lng);
  	// using global variable:
  	map.panTo(center);

  	let marker = new google.maps.Marker({
			map,
			position: center,
			icon: {url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"},
			title: "You are Here"
	});

}

    document.getElementById("marker_button").addEventListener('click', handle_button);

};

// Frame constants for the bar chart
const frame_height = 500;
const frame_width = 400;
const margins = {left: 100, right: 100, top: 100, bottom: 100};
const review_color = {"1 star": "#E92E1F", "2 star": "#E9931F", "3 star": "#DAE91F", "4 star": "#75E91F", "5 star": "#1FE92E"};

function load_bar(star_counts, date_counts) {
	// Deletes the graph if it exists
	d3.select("#vis2").selectAll("*").remove();

	// Creates a frame for the bar chart
	const FRAME2 =
	d3.select("#vis2")
	    .append("svg")
	    .attr("height", frame_height)
	    .attr("width", frame_width)
	    .attr("class", "frame");


	// Fills the bar chart with data from the csv
	d3.csv("data/yelp_business_clean.csv").then((data) => {
		// Finds the max value of the star count
		let max_star = Math.max(star_counts["1 star"], star_counts["2 star"], star_counts["3 star"],
			star_counts["4 star"], star_counts["5 star"])

		//for later to iterate colors through hard coded bar qty
		colors = d3.scaleOrdinal(Object.values(review_color));

		//for later to iterate star values through hard coded bar qty
		star_values = d3.scaleOrdinal(Object.keys(review_color));

    	// Generates a set of scales for the x and y axes
		const y_scale =
		d3.scaleLinear()
		    .domain([0, max_star + 1])
		    .range([(frame_height - margins.bottom), margins.top]);

		const x_scale =
		d3.scaleBand()
		    .domain(Object.keys(review_color))
		    .range([0, (frame_width - margins.right), 0]);

		FRAME2.append("g")
		    .attr("transform", "translate(" + margins.left + ")")
		    .call(
			    d3.axisLeft()
			        .scale(y_scale)
			        .ticks(5)
			)
		    .attr("font-size", "20px");

		FRAME2.append("g")
		    .attr("transform", "translate(" + margins.left + "," + (frame_height - margins.bottom) + ")")
		    .call(
			    d3.axisBottom()
			        .scale(x_scale)
			        .ticks(10)
			);

    	// Adds to the correct bar for each restaurant
		Object.entries(star_counts).forEach(entry => {
			const [key, value] = entry;
			FRAME2.append("rect")
			    .attr("transform", "translate(" + margins.left +  ")")
			    .attr("x", (x_scale(key)))
			    .attr("y", y_scale(value))
			    .attr("height", ( frame_height - y_scale(value) - margins.bottom))
			    .attr("width", x_scale.bandwidth() - 5)
			    .attr("class", "bar")
			    .attr("id", key);
		});

		FRAME2.selectAll(".bar")
		    .attr("fill", (d,i) => {return colors(i)})
		    .attr("id", (d,i) => {return i})

		FRAME2.append("text")
		    .attr("x", ((frame_width) - (margins.right))/2)
		    .attr("y", margins.top)
		    .text("Review Distribution")
		    .attr("class", "title");

		FRAME2.append("text")
		    .attr("x", ((frame_width) )/2)
		    .attr("y", (frame_height - margins.top/2))
		    .text("Yelp Star Rating")
		    .attr("class", "label");

		FRAME2.append("text")
		    .attr("x", (-frame_height/2) - margins.top/2)
		    .attr("y", ((margins.top/2)))
		    .attr("transform", "rotate(270)")
		    .text("Review Count")
		    .attr("class", "label");

    	// Creates a tooltip for the bar chart
		const tooltip =
		d3.select("#vis2")
		    .append("div")
		    .attr("class", "tooltip")
		    .style("opacity", 0);

    	// Shows the tooltip when the mouse moves over a bar
		function handleMouseover(event, d) {
			tooltip.style("opacity", 1);
		    d3.select(this).style("opacity", 0.5);
		}

    	// Updates the tooltip with the correct information
		function handleMousemove(event, d, bar) {
			tooltip.html("Most Recent Review of this Rating: " + date_counts[bar.id])
			.style("left", (d.pageX + 10) + "px")
			.style("top", (d.pageY + 50) + "px");
		}

    	// Hides the tooltip when the mouse leaves a bar
		function handleMouseleave(event, d) {
			tooltip.style("opacity", 0);
			FRAME2.selectAll(".bar")
                .style("opacity", 1);
		}

    	// Attaches event handlers to all the bars
		FRAME2.selectAll(".bar")
		    .on("mouseover", handleMouseover)
		    .on("mousemove", function () {handleMousemove(0,0,this)})
		    .on("mouseleave", handleMouseleave);
	});
}

