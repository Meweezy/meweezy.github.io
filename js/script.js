const url = "https://disease.sh/v2/countries";
let markers = [];
let countries;
let map;
//var infoWindow;

// Initialize and add the map
window.onload = () => {
  getCountryData();
  getHistoricalData();
  // buildPieChart();
  getCurrentData();
};

function initMap() {
  // The location of Germany
  var germany = { lat: 51.1657, lng: 10.4515 };
  // The map, centered at Germany
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 3,
    styles: mapStyle,
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

const getCurrentData = () => {
  fetch("https://disease.sh/v2/all?yesterday=false")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // let chartData = buildPieChartData(data);
      buildPieChart(data);
    });
};

//build pie chart
const buildPieChart = (pieChartData) => {
  console.log(pieChartData);
  var ctx = document.getElementById("pieChart").getContext("2d");
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "doughnut",

    // The data for our dataset
    data: {
      labels: [
        "Total Cases",
        "Total Deaths",
        "Total Recovered",
        "Total Active",
      ],
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: [
            "#2ecc71",
            "#3498db",
            "#95a5a6",
            "#9b59b6",
            "#f1c40f",
            "#e74c3c",
            "#34495e",
          ],
          data: [
            pieChartData.cases,
            pieChartData.deaths,
            pieChartData.recovered,
            pieChartData.active,
          ],
        },
      ],
    },

    // Configuration options go here
    options: {
      animation: {
        animateScale: true,
      },
    },
  });
};

const buildPieChartData = (data) => {
  let pieChartData = [];

  // console.log("Pie Chart Data : " + data.cases);
};

const buildChartData = (data) => {
  `
  required format:
  [
    {
      x: data,
      y: 4352
    }


  ]
  `;
  let chartData = [];

  for (let date in data.cases) {
    let newDataPoint = {
      x: date,
      y: data.cases[date],
    };
    chartData.push(newDataPoint);
  }
  return chartData;
};

const buildRecovered = (data) => {
  let recoveredData = [];

  for (let date in data.recovered) {
    let newDataPoint = {
      x: date,
      y: data.recovered[date],
    };
    recoveredData.push(newDataPoint);
  }
  return recoveredData;
};

const buildDeaths = (data) => {
  let deathsData = [];

  for (let date in data.deaths) {
    let newDataPoint = {
      x: date,
      y: data.deaths[date],
    };
    deathsData.push(newDataPoint);
  }
  return deathsData;
};

const getHistoricalData = () => {
  fetch("https://disease.sh/v2/historical/all?lastdays=150")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let chartData = buildChartData(data);
      let recoveredData = buildRecovered(data);
      let deathsData = buildDeaths(data);
      buildChart(chartData, recoveredData, deathsData);
    });
};

//build line chart
const buildChart = (chartData, recoveredData, deathsData) => {
  var timeFormat = "MM/DD/YYYY";

  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      // labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Total Cases",
          backgroundColor: "#1d2c4d",
          borderColor: "#1d2c4d",
          data: chartData,
          fill: false,
        },
        {
          label: "Total Recovered",
          backgroundColor: "green",
          borderColor: "green",
          data: recoveredData,
          fill: false,
        },
        {
          label: "Total Deaths",
          backgroundColor: "red",
          borderColor: "red",
          data: deathsData,
          fill: false,
        },
      ],
    },

    // Configuration options go here
    options: {
      tooltips: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "index",
        intersect: false,
      },
      scales: {
        xAxes: [
          {
            type: "time", //Moment.js required to use time axis
            time: {
              format: timeFormat,
              tooltipFormat: "ll",
            },
            scaleLabel: {
              display: true,
              labelString: "Date",
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              callback: function (value, index, values) {
                return numeral(value).format("0,0");
              },
            },
          },
        ],
      },
    },
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
            <td>${numeral(country.cases).format("0,0")}</td>
           <td>${numeral(country.recovered).format("0,0")}</td>
           <td>${numeral(country.deaths).format("0,0")}</td>
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
