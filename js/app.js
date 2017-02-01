var map;
var markers = [];
var locations = [
  {title: 'Stonehouse Pet', location: {lat: 14.455943, lng: 79.992699}},
  {title: 'Golconda Fort', location: {lat: 17.385363, lng: 78.40413}},
  {title: 'Tirumala', location: {lat: 13.678184, lng: 79.332357}},
  {title: 'Hampi', location: {lat: 15.335013, lng: 76.460025}},
  {title: 'Papikondalu', location: {lat: 17.479712, lng: 81.493313}},
  {title: 'Simhachalam', location: {lat: 17.774162, lng: 83.231863}},
  {title: 'Madurai', location: {lat: 9.925201, lng: 78.119775}},
  {title: 'Rameswaram', location: {lat: 9.287625, lng: 79.312929}},
];
      function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 14.462188158, lng: 79.99894781},
          zoom: 13
        });

        var largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        locations[i].marker = marker;

        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
          map: map,
          position: position,
          title: title,
          animation: google.maps.Animation.DROP,
          id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
          populateInfoWindow(this, largeInfowindow);
        });
        bounds.extend(markers[i].position);
      }
      // Extend the boundaries of the map for each marker
      map.fitBounds(bounds);
    }

    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker, infowindow) {
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker != marker) {

        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
          infowindow.setMarker(null);
        });

		}
	}
var ViewModel = function() {
  this.locationList = ko.observableArray(locations);
  
}
ko.applyBindings(new ViewModel());
