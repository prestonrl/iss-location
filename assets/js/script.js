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
document.querySelector('#city').style.height = "35px";


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

    var latitude = weather.coord.lat;
    var longitude = weather.coord.lon;
    console.log(weather);



    var latEl = document.createElement('span');
    latEl.textContent = "Latitude: " + latitude + "°";
    latEl.classList = "list-group-item";

    var lonEl = document.createElement('span');
    lonEl.textContent = "Longitude: " + longitude + "°";
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

    var latEl = document.createElement('span');
    latEl.textContent = "Latitude: " + iss.latitude + "°";
    latEl.classList = "list-group-item";

    var lonEl = document.createElement('span');
    lonEl.textContent = "Longitude: " + iss.longitude + "°";
    lonEl.classList = "list-group-item";

    issDisplayEl.appendChild(latEl);
    issDisplayEl.appendChild(lonEl);
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