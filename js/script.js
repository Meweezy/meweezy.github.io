const url = "https://disease.sh/v2/countries";
let markers = [];
let countries;
let map;
//var infoWindow;

// Initialize and add the map
window.onload = () => {
  getCountryData();
};

function initMap() {
  // The location of Germany
  var germany = { lat: 51.165690999999995, lng: 10.451526 };
  // The map, centered at Germany
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: germany,
  });

  //infoWindow = new google.maps.InfoWindow();
  // The marker, positioned at germany
  //var marker = new google.maps.Marker({ position: germany, map: map });
  //searchCountries(url, countries);
  // //Get JSON Data
}

const getCountryData = () => {
  fetch("https://disease.sh/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showDataOnMap(data);
      showDataInTable(data);
    });
};

const showDataOnMap = (data) => {
  data.map((country) => {
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };

    var countryCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,
      center: countryCenter,
      radius: country.casesPerOneMillion * 15,
      // radius: Math.sqrt(country.population) * 20,
    });

    var html = `
    <div class="info-container">
    <div class="info-flag" style="background-image: url(${country.countryInfo.flag})"></div>

        <div class="info-name">${country.country}</div>
        <div class="info-confirmed">Total Cases: ${country.cases}</div>
        <div class="info-active">Active Cases: ${country.active}</div>
        <div class="info-deaths">Total Deaths: ${country.deaths}</div>
        <div class="info-recovered">Total Recovered: ${country.recovered}</div>
    </div>
  
    `;

    var infoWindow = new google.maps.InfoWindow({
      content: html,
      position: countryCenter,
    });

    google.maps.event.addListener(countryCircle, "mouseover", function (ev) {
      infoWindow.open(map);
    });

    google.maps.event.addListener(countryCircle, "mouseout", function (ev) {
      infoWindow.close();
    });
  });
};

// //Get JSON
// getAllCases = (url) => {
//   const casesPromise = fetch(url);
//   return casesPromise.then((response) => {
//     //console.log(response.json());
//     return response.json();
//   });
// };

//Display data in table
const showDataInTable = (data) => {
  let html = "";
  const tableOnPage = document.getElementById("tableOnPage");

  // data.map((country) => {
  //   tableOnPage.innerHTML = `

  //       <tr>
  //         <th scope="row">${country.country}</th>
  //         <td>${country.cases}</td>
  //         <td>${country.recovered}</td>
  //         <td>${country.deaths}</td>
  //       </tr>

  //   `;
  // });
  data.forEach((country) => {
    html += `
    
          <tr>
            <td>${country.country}</td>
            <td>${country.cases}</td>
           <td>${country.recovered}</td>
           <td>${country.deaths}</td>
         </tr>
      
      
       `;
  });
  tableOnPage.innerHTML = html;
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
