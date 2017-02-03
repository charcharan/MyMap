var map;
var markers = [];
var largeInfowindow;
var infowindow;
var locations = [
    { title: 'Stonehouse Pet', location: { lat: 14.455943, lng: 79.992699 } },
    { title: 'Golconda Fort', location: { lat: 17.385363, lng: 78.40413 } },
    { title: 'Tirumala', location: { lat: 13.678184, lng: 79.332357 } },
    { title: 'Hampi', location: { lat: 15.335013, lng: 76.460025 } },
    { title: 'Papikondalu', location: { lat: 17.479712, lng: 81.493313 } },
    { title: 'Simhachalam', location: { lat: 17.774162, lng: 83.231863 } },
    { title: 'Madurai', location: { lat: 9.925201, lng: 78.119775 } },
    { title: 'Rameswaram', location: { lat: 9.287625, lng: 79.312929 } },
];

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 14.462188158, lng: 79.99894781 },
        zoom: 13
    });

    largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();



    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // locations[i].marker = marker;

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
        locations[i].marker = marker;

    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.

        var articleUrl;
        var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
        var wikiTimeout = setTimeout(function () {
           alert("failed to load wikipedia page");
       }, 8000);
       $.ajax({
           url: wikiURL,
           dataType: "jsonp"
           //jsnop datatype
       }).success(function(response) {
           //timeout is cleared if wikipedia link is loaded successfully
           clearTimeout(wikiTimeout);
           //response from wikipedia api
           articleUrl = response[1];
           });
           if (infowindow.marker != marker) {

               infowindow.marker = marker;
               infowindow.setContent('<div>' + marker.title + '</div><br><a href ="' + articleUrl + '">' + articleUrl + '</a><hr>');
               infowindow.open(map, marker);
               marker.setAnimation(google.maps.Animation.BOUNCE);
               setTimeout(function() {
                   marker.setAnimation(null);
               }, 3000);




        // TODO: Create an AJAX request to a third party site (e.g. wikipedia)
        // ex: $.ajax({construct the query here})
        // .done(function(response) {})
        // .fail(function(error) {});

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            // infowindow.setMarker(null);
            infowindow.marker = null;
        });

    }
}
var loc;
var ViewModel = function() {
    var self = this;
    self.currentFilter = ko.observable('');
    this.title = ko.observable(locations[0].title);

    this.locationList = ko.observableArray(locations);

    this.filteredList = ko.computed(function() {
        // if the filter is empty, return every elements and show every markers
        if (self.currentFilter().length === 0) {
          // TODO: loop through every locations and show their markers
          for (var i = 0; i < self.locationList().length; i++) {
            // save the current iteratee as "loc" for easier reference
            loc = self.locationList()[i];
            console.log(loc);
            loc.marker.setVisible(true);
          }
          // self.locationList()[3].marker.setVisible(true);
          // return the entire location list from the comp. observable
          return self.locationList();
        }

        // create a temporary array - we will return it from the computed observable
        var tempArray = [];
        // loop through the locationList
        for (var i = 0; i < self.locationList().length; i++) {
          // save the current iteratee as "loc" for easier reference
          loc = self.locationList()[i];
          // if the filter is inside the title...
          // OPTIONAL TODO: convert title and the currentFilter
          // to lowercase before comparing them
          if (loc.title.indexOf(self.currentFilter()) !== -1) {
            // add the location to the temporary array
            tempArray.push(loc);
            // show the marker
            loc.marker.setVisible(true);
          } else {
            // hide the marker
            loc.marker.setVisible(false);
          }
        }
        // then return the temporary array from the comp. observable
        // so it's value will be the filtered list
        return tempArray;
    }, this);


    this.setLoc = function(clickedLoc) {

        google.maps.event.trigger(clickedLoc.marker, 'click');

        console.log(clickedLoc);

    };





};

ko.applyBindings(new ViewModel());
