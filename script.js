let currentTemperatureCelsius = null;
let isCelsius = true;
let forecastData = [];

function displayForecast(forecastData) {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";

  forecastData.forEach(function (day, index) {
    if (index < 5) {
      let maxTemp = day.temperature.maximum;
      let minTemp = day.temperature.minimum;

      if (!isCelsius) {
        maxTemp = celsiusToFahrenheit(maxTemp);
        minTemp = celsiusToFahrenheit(minTemp);
      }

      forecastHTML += `
        <div class="weather-forecast-day">
          <div class="weather-forecast-date">${formatDay(day.time)}</div>
          <div class="weather-forecast-icon">
            <img src="${day.condition.icon_url}" width="50" height="50" alt="${
        day.condition.description
      }" />
          </div>
          <div class="weather-forecast-temperatures">
            <div class="weather-forecast-temperature">
              <strong>${Math.round(maxTemp)}°</strong>
            </div>
            <div class="weather-forecast-temperature">${Math.round(
              minTemp
            )}°</div>
          </div>
        </div>
      `;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "b2a5adcct04b33178913oc335f405433";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}`;

  axios
    .get(apiUrl)
    .then(function (response) {
      forecastData = response.data.daily;
      displayForecast(forecastData);
    })
    .catch(function (error) {
      console.log("Error fetching forecast data:", error);
      document.querySelector("#forecast").innerHTML = "";
    });
}

function refreshWeather(response) {
  document.querySelector("#error-message").style.display = "none";
  document.querySelector("#loading").style.display = "none";

  let temperatureElement = document.querySelector("#temperature");
  currentTemperatureCelsius = response.data.temperature.current;
  let temperature = currentTemperatureCelsius;

  if (!isCelsius) {
    temperature = celsiusToFahrenheit(temperature);
  }

  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");

  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" alt="${response.data.condition.description}" />`;

  getForecast(response.data.city);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  document.querySelector("#loading").style.display = "block";
  document.querySelector("#error-message").style.display = "none";

  let apiKey = "b2a5adcct04b33178913oc335f405433";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;

  axios
    .get(apiUrl)
    .then(refreshWeather)
    .catch(function (error) {
      document.querySelector("#loading").style.display = "none";
      document.querySelector("#error-message").style.display = "block";
      console.log("Error fetching weather data:", error);
    });
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");

  if (searchInput.value.trim() !== "") {
    searchCity(searchInput.value);
  }
}

function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function displayCelsius(event) {
  event.preventDefault();
  if (!isCelsius) {
    isCelsius = true;
    document.querySelector("#celsius-button").classList.add("active");
    document.querySelector("#fahrenheit-button").classList.remove("active");
    document.querySelector("#temperature").innerHTML = Math.round(
      currentTemperatureCelsius
    );
    document.querySelector("#temperature-unit").innerHTML = "°C";

    if (forecastData.length > 0) {
      displayForecast(forecastData);
    }
  }
}

function displayFahrenheit(event) {
  event.preventDefault();
  if (isCelsius) {
    isCelsius = false;
    document.querySelector("#celsius-button").classList.remove("active");
    document.querySelector("#fahrenheit-button").classList.add("active");
    let fahrenheitTemperature = celsiusToFahrenheit(currentTemperatureCelsius);
    document.querySelector("#temperature").innerHTML = Math.round(
      fahrenheitTemperature
    );
    document.querySelector("#temperature-unit").innerHTML = "°F";

    if (forecastData.length > 0) {
      displayForecast(forecastData);
    }
  }
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

document
  .querySelector("#celsius-button")
  .addEventListener("click", displayCelsius);
document
  .querySelector("#fahrenheit-button")
  .addEventListener("click", displayFahrenheit);

searchCity("Paris");
