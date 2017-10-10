$(document).ready(function() {

  var farenheitQ = true;
  var tempF;
  var tempC;
  
  var getLocation = function() {
    navigator.geolocation.getCurrentPosition(showPosition);
  };

  var showPosition = function(position) {
    // get dark sky api data
    $.getJSON("https://cors-anywhere.herokuapp.com/https://fcc-weather-api.glitch.me/api/current?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude, function(json) {
      document.getElementById("summary").innerHTML = json["weather"][0]["description"].charAt(0).toUpperCase() + json["weather"][0]["description"].slice(1);

      document.getElementById("image").src = json["weather"][0]["icon"];
      
      tempC = json["main"]["temp"];
      tempF = (tempC * 9 / 5 + 32).toFixed(2);
      document.getElementById("temperature-text").innerHTML = tempF + " &deg;F";
      
      document.getElementById("wind-speed").innerHTML = "wind: " + json["wind"]["speed"] + " mph";
      document.getElementById("humidity").innerHTML = "humidity: " + json["main"]["humidity"] + "%";
      document.getElementById("pressure").innerHTML = "pressure: " + json["main"]["pressure"] + " hPa";
      
      $("#temp-convert").on("click", function(){
        if (farenheitQ) {
          document.getElementById("temperature-text").innerHTML = tempC + " &deg;C";
          document.getElementById("temp-convert").innerHTML = "convert to &deg;F";
          farenheitQ = false;
        }
        else {
          document.getElementById("temperature-text").innerHTML = tempF + " &deg;F";
          document.getElementById("temp-convert").innerHTML = "convert to &deg;C";
          farenheitQ = true;
        }
      });
    });

    // get address data: city, state, and country
    $.getJSON("https://cors-anywhere.herokuapp.com/https://nominatim.openstreetmap.org/reverse?format=json&lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&addressdetails=1", function(json) {
      var cityTownVillage;
      if (json["address"]["city"] !== undefined)
        cityTownVillage = json["address"]["city"];
      else if (json["address"]["town"] !== undefined)
        cityTownVillage = json["address"]["town"];
      else if (json["address"]["village"] !== undefined)
        cityTownVillage = json["address"]["village"];
      else
        cityTownVillage = "";

      if (json["address"]["state"] == cityTownVillage || json["address"]["state"] == json["address"]["country"])
        document.getElementById("city-state").innerHTML = cityTownVillage;
      else if (cityTownVillage === "")
        document.getElementById("city-state").innerHTML = json["address"]["state"];
      else // the usual case
        document.getElementById("city-state").innerHTML = cityTownVillage + ", " + json["address"]["state"];

      document.getElementById("country").innerHTML = json["address"]["country"];
    });
  };

  getLocation();


});