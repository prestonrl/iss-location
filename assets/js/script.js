var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector('#city');
var pastCityBtnEl = document.querySelector('#previous-cities')
var cityEl = document.querySelector('#current-city');
var locationDisplayEl = document.querySelector('#location-container');
var issDisplayEl = document.querySelector('#iss');
var distDisplayEl = document.querySelector('#dist');
var issTitleEl = document.querySelector('#iss-title');
var distTitleEl = document.querySelector('#dist-title');
var previousCityEl = document.querySelector('#previous-cities');
var currentLocationEl = document.querySelector('#current-location');
var issLocationEl = document.querySelector('#iss-location');
var distLocationEl = document.querySelector('#dist-location');
var cities = [];
var apiKey = "4e58e97fdd4f6e5374486a7e4a85fd81";
var issAlt = 0;
var issLon = 0;
var issLat = 0;
var enteredLat = 0;
var enteredLon = 0;


var searchedCity = function (event) {
    event.preventDefault();
    var currentCity = cityInputEl.value.trim();

    if (currentCity) {
        getLocation(currentCity);
        cityInputEl.value = "";
    }
    else {
        alert("Please enter a city before searching");
    }
};

var saveCity = function (currentCity) {
    if (cities.indexOf(currentCity) !== -1) {
        return;
    } else {
        cities.push(currentCity);
        localStorage.setItem("cities", JSON.stringify(cities));
        previousSearch(currentCity);
    }
};

var loadPrevious = function () {
    cities = JSON.parse(localStorage.getItem("cities")) || [];
    for (i = 0; i < cities.length; i++) {
        previousSearch(cities[i]);
    }
};

var previousSearch = function (pastCity) {
    pastCityEl = document.createElement("button");
    pastCityEl.textContent = pastCity;
    pastCityEl.classList = "d-flex w-100 btn-light border p-2";
    pastCityEl.setAttribute("data-city", pastCity);
    pastCityEl.setAttribute("type", "submit");

    pastCityBtnEl.prepend(pastCityEl);
};

var getLocation = function (city) {
    var apiSite = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiSite)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    loadLocation(data, city);
                    saveCity(city);
                });
            }
            else {
                alert("Error: " + response.statusText);
                return;
            }
        });
};

var loadLocation = function (weather, currentCity) {
    locationDisplayEl.textContent = "";
    cityEl.textContent = currentCity;
    currentLocationEl.classList.add('border', 'p-2', 'is-size-3');

    enteredLat = (Math.round(weather.coord.lat * 100) / 100).toFixed(2);
    enteredLon = (Math.round(weather.coord.lon * 100) / 100).toFixed(2);

    var latEl = document.createElement('span');
    latEl.textContent = "Latitude: " + enteredLat + "°";
    latEl.classList = "label";

    var lonEl = document.createElement('span');
    lonEl.textContent = "Longitude: " + enteredLon + "°";
    lonEl.classList = "label";

    locationDisplayEl.appendChild(latEl);
    locationDisplayEl.appendChild(lonEl);


    getISS();
};



var getISS = function () {
    var apiSite = `https://api.wheretheiss.at/v1/satellites/25544`;

    fetch(apiSite)
        .then(function (response) {
            response.json().then(function (data) {
                loadISS(data);
            });
        });
};

var loadISS = function (iss) {
    issTitleEl.textContent = "ISS Location:"
    issDisplayEl.textContent = "";
    issLocationEl.classList.add('border', 'p-2', 'is-size-3');

    issLat = (Math.round(iss.latitude * 100) / 100).toFixed(2);
    issLon = (Math.round(iss.longitude * 100) / 100).toFixed(2);
    issAlt = (Math.round(iss.altitude * 100) / 100).toFixed(2);

    var latEl = document.createElement('span');
    latEl.textContent = "Latitude: " + issLat + "°";
    latEl.classList = "label";

    var lonEl = document.createElement('span');
    lonEl.textContent = "Longitude: " + issLon + "°";
    lonEl.classList = "label";

    var altEl = document.createElement('span');
    altEl.textContent = "Altitude: " + (Math.round((issAlt/ 1.609) * 100) / 100).toFixed(2) + " mi";
    altEl.classList = "label";

    var velEl = document.createElement('span');
    velEl.textContent = "Velocity: " + (Math.round((iss.velocity/ 1.609) * 100) / 100).toFixed(2) + " MPH";
    velEl.classList = "label";
    
    var visEl = document.createElement('span');
    visEl.textContent = "Visibility: " + iss.visibility;
    visEl.classList = "label";

    issDisplayEl.appendChild(latEl);
    issDisplayEl.appendChild(lonEl);
    issDisplayEl.appendChild(altEl);
    issDisplayEl.appendChild(velEl);
    issDisplayEl.appendChild(visEl);

    calcDistance();
    convertLatLong(issLat, issLon);
};

function convertLatLong(latitude, longitude) {
    var apiSite = `https://cors-anywhere.herokuapp.com/http://api.positionstack.com/v1/reverse?access_key=7ea1c67aa559e0d3ca2f78be3f4734f3&query=${latitude},${longitude}`;
    fetch(apiSite)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    var isAbove = data.data[0].label;

                    var visEl = document.createElement('span');
                    visEl.textContent = "The ISS is above " + isAbove;
                    visEl.classList = "label";
                    distDisplayEl.appendChild(visEl);
                });
            }
            else {
                alert("Error: " + response.statusText);
                return;
            }
        });

}

function getLongestSide(sideA, sideB) {
    return Math.sqrt(sideA * sideA + sideB * sideB)
}

function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

var calcDistance = function () {
  
    var dis = distance(enteredLat, enteredLon, issLat, issLon);
   

    var longSide = getLongestSide(dis, issAlt);
    //divide by 1.609 to convert to miles
    var longSideAns = Math.round(longSide / 1.609);;

    distTitleEl.textContent = "Distance:"
    distDisplayEl.textContent = "";
    distLocationEl.classList.add('border', 'p-2', 'is-size-3');

    var visEl = document.createElement('span');
    visEl.textContent = "The ISS is approximately " + longSideAns + " miles away";
    visEl.classList = "label";
    distDisplayEl.appendChild(visEl);
    
};

var previousSearchHandler = function (event) {
    var city = event.target.getAttribute('data-city');
    if (city) {
        getLocation(city);
    }
};

userFormEl.addEventListener("submit", searchedCity);
previousCityEl.addEventListener("click", previousSearchHandler);
loadPrevious();