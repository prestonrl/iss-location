var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector('#city');
var pastCityBtnEl = document.querySelector('#previous-cities')
var cityEl = document.querySelector('#current-city');
var locationDisplayEl = document.querySelector('#location-container');
var issDisplayEl = document.querySelector('#iss');
var issTitleEl = document.querySelector('#iss-title');
var previousCityEl = document.querySelector('#previous-cities');
var currentLocationEl = document.querySelector('#current-location');
var issLocationEl = document.querySelector('#iss-location');
var cities = [];
var apiKey = "4e58e97fdd4f6e5374486a7e4a85fd81";
var issAlt = 0;
var issLon = 0;
var issLat = 0;
var enteredLat = 0;
var enteredLon = 0;
d


var searchedCity = function (event) {
    event.preventDefault();
    var currentCity = cityInputEl.value.trim();
    //console.log(currentCity);

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
    //console.log(pastCity);
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
    currentLocationEl.classList.add('border', 'p-2');

    enteredLat = weather.coord.lat;
    enteredLon = weather.coord.lon;
    console.log(weather);



    var latEl = document.createElement('span');
    latEl.textContent = "Latitude: " + enteredLat + "°";
    latEl.classList = "list-group-item";

    var lonEl = document.createElement('span');
    lonEl.textContent = "Longitude: " + enteredLon + "°";
    lonEl.classList = "list-group-item";

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
    issLocationEl.classList.add('border', 'p-2');
    console.log(iss);

    issLat = iss.latitude;
    issLon = iss.longitude;
    issAlt = iss.altitude;

    var latEl = document.createElement('span');
    latEl.textContent = "Latitude: " + issLat + "°";
    latEl.classList = "list-group-item";

    var lonEl = document.createElement('span');
    lonEl.textContent = "Longitude: " + issLon + "°";
    lonEl.classList = "list-group-item";

    var altEl = document.createElement('span');
    altEl.textContent = "Altitude: " + issAlt;
    altEl.classList = "list-group-item";

    var velEl = document.createElement('span');
    velEl.textContent = "Velocity: " + iss.velocity;
    velEl.classList = "list-group-item";
    
    var visEl = document.createElement('span');
    visEl.textContent = "Visibility: " + iss.visibility;
    visEl.classList = "list-group-item";

    issDisplayEl.appendChild(latEl);
    issDisplayEl.appendChild(lonEl);
    issDisplayEl.appendChild(altEl);
    issDisplayEl.appendChild(velEl);
    issDisplayEl.appendChild(visEl);

    calcDistance();
};

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
    console.log(issLat);
    console.log(issLon);
    console.log(issAlt);
    console.log(enteredLat);
    console.log(enteredLon);

    var dis = distance(enteredLat, enteredLon, issLat, issLon);
    console.log(dis);

    var longSide = getLongestSide(dis, issAlt);
    //divide by 1.609 to convert to miles
    var longSideAns = Math.round(longSide / 1.609);;
    console.log(issAlt)
    console.log("The ISS is approximately " + longSideAns + " miles away")

    var visEl = document.createElement('span');
    visEl.textContent = "The ISS is approximately " + longSideAns + " miles away";
    visEl.classList = "list-group-item";
    issDisplayEl.appendChild(visEl);
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