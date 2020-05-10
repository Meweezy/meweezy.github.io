const url = "https://disease.sh/v2/countries";
let markers = [];
let countries;
let map;

// //Get JSON Data

// let request = new XMLHttpRequest();
// request.open("GET", "https://disease.sh/v2/countries", true);

// request.onload = function () {
//   //console.log(this.responseText);
//   //let countries = this.response;
//   let countries = JSON.parse(this.response);
//   //console.log(countries);
//   //   countries.forEach((country) => {
//   //     if (country.country == "Argentina") {
//   //       console.log(country.country.toString().toUpperCase());
//   //       console.log("Confirmed Cases: " + country.cases);
//   //       console.log("Total Recovered: " + country.recovered);
//   //       console.log("Total Deaths: " + country.deaths);
//   //     }
//   //   });
//   searchCountries(countries);
// };

// request.send();

// //End get JSON Data

// Initialize and add the map

function initMap() {
  // The location of Germany
  var germany = { lat: 51.165690999999995, lng: 10.451526 };
  // The map, centered at Germany
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: germany,
  });
  // The marker, positioned at germany
  //var marker = new google.maps.Marker({ position: germany, map: map });
  searchCountries(url, countries);
  // //Get JSON Data
}

//Get JSON
getAllCases = (url) => {
  const casesPromise = fetch(url);
  return casesPromise.then((response) => {
    //console.log(response.json());
    return response.json();
  });
};

//Search Countries
function searchCountries(url, countries) {
  countries = getAllCases(url)
    .then((response) => {
      console.log(response);
      let index = 1;
      clearLocations();
      for (let country of response) {
        console.log(country);
        showMarkers(country, index);
        index++;
      }
    })
    .catch((error) => {
      console.log(error);
    });

  //  console.log(countries);
  // for (let country of countries) {
  //   //console.log(country);
  //   //console.log(foundCountries);
  //   showMarkers(countries);
  // }
}

//Show Markers
function showMarkers(countries, index, timeout) {
  var bounds = new google.maps.LatLngBounds();
  var latlng = new google.maps.LatLng(
    countries.countryInfo["lat"],
    countries.countryInfo["long"]
  );
  console.log("Coordinates: " + latlng);
  console.log(index);
  var name = countries.country;
  var totalCases = countries.cases;
  var totalRecovered = countries.recovered;
  var totalDeaths = countries.deaths;

  // for (var country in countries) {
  //   //console.log(country.country);
  //   var latlng = new google.maps.LatLng(
  //     // country["latitude"],
  //     countries.countryInfo["latitude"],
  //     countries.countryInfo["longitude"]
  //   );
  //   console.log("Latitued: " + countries.countryInfo["latitude"]);
  //   var name = country["country"];
  //   var totalCases = country["cases"];
  //   var totalRecovered = country["recovered"];
  //   var totalDeaths = country["deaths"];

  bounds.extend(latlng);

  createMarker(
    latlng,
    name,
    totalCases,
    index,
    totalRecovered,
    totalDeaths,
    timeout
  );

  map.fitBounds(bounds);
}
//Create markers
function createMarker(
  latlng,
  name,
  totalCases,
  index,
  totalRecovered,
  totalDeaths,
  timeout
) {
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: index.toString(), //country index
    animation: google.maps.Animation.DROP,
  });

  markers.push(marker);
}

function clearLocations() {
  //infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function placeMarkerAndPanTo(latLng, map) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
}
