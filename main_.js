//let map;

window.initMap = function() {
	// Create the Google Map…
	let map = new google.maps.Map(d3.select("#map").node(), {
		zoom: 13,
		center: new google.maps.LatLng(34.45, -119.7),
	});


	// Create the markers
	d3.csv("data/yelp_business_clean.csv", function(data) {

		// Reference link: https://developers.google.com/maps/documentation/javascript/markers#animate
		marker = new google.maps.Marker({
			map,
			position: { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) }
		});
	});
};

window.initMap = initMap

