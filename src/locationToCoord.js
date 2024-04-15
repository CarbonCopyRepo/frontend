function initAutocomplete() {
    var input = document.getElementById('locationInput');
    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();

        document.getElementById('coordinates').innerHTML = "Latitude: " + lat + "<br>Longitude: " + lng;

        // You can use the lat and lng values to display a map or perform other actions
        // For example, here we're displaying a simple map using Google Maps JavaScript API
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: lat, lng: lng},
            zoom: 12
        });

        var marker = new google.maps.Marker({
            map: map,
            position: {lat: lat, lng: lng}
        });
    });
}



