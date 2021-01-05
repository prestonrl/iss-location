

var issAlt = 0
var issLon = 0
var issLat = 0
var enteredLat = 39.3210
var enteredLon = 111.0937



function getISSinfo(){
    var issAPI = `https://api.wheretheiss.at/v1/satellites/25544`;
    fetch(issAPI).then(function(response){
        response.json().then(function(data){
        issAlt = data.altitude;
        issLon = data.longitude;
        issLat = data.latitude;
    });
  });
}

getISSinfo();

//converts lat long to an address (to know what region/country/etc the ISS is)

function convertLatLong(latitude, longitude) {
    fetch(`http://api.positionstack.com/v1/reverse?access_key=7ea1c67aa559e0d3ca2f78be3f4734f3&query=${latitude},${longitude}`)
    .then(response => response.json())
    .then(data => console.log(data.data[0].label)); //currently sent up to label the address of location. 

}

convertLatLong(18.88153915163, 69.953423766056)


// using weather api to allow user to enter location and get long/lat

function locationSearch(location){
    var currentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=cdbe094b63f52ec5b9bfa25eae6ac11f`;
    fetch(currentWeatherAPI).then(function(response){
        response.json().then(function(data){    
        var lon = data.coord.lon
        var lat = data.coord.lat
    });
  });
}

//calculates triangle (distance to ISS)

function getLongestSide(sideA, sideB) {
    return Math.sqrt(sideA*sideA + sideB*sideB)
}

//calculates the distance between two different latitudes and longitudes

function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

//calculating the distance 

function waitToCalculate() {
    return new Promise(resolve => {
      setTimeout(() => {
        getISSinfo();

        var dis = distance(enteredLat, enteredLon, issLat, issLon);
        console.log(dis);
    
        var longSide = getLongestSide(dis, issAlt);
        //divide by 1.609 to convert to miles
        var longSideAns = Math.round(longSide/1.609);        ;
        console.log(issAlt)
        console.log("The ISS is approximately " + longSideAns + " miles away")

      }, 2000);
    });
  }
  
  //async func to calculate distance after everything has ran

  async function calculateDistance() {
    console.log('calling');
    const result = await waitToCalculate();
    console.log(result);
  }
  
  calculateDistance();
  