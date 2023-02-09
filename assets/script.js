$(document).ready(function () {
  // Add user input for the city
  $("form").submit(function (event) {
    event.preventDefault();
    const API_KEY = "5111297b359fd6c2201ce081633e2699";
    const city = $("#search-input").val();

    // Call the function to show weather for the selected city
    showWeather(city);

    let cities = JSON.parse(localStorage.getItem("cities")) || [];
    if (!cities.includes(city)) {
      cities.unshift(city);
      if (cities.length > 5) {
        cities.pop();
      }
    }
    localStorage.setItem("cities", JSON.stringify(cities));
    localStorage.setItem("city", city);

    // Retrieve search history from local storage
    let searchHistory = JSON.parse(localStorage.getItem("cities"));

    // Display search history
    if (searchHistory) {
      const historyContainer = document.querySelector("#history");
      // Clear any existing search history from the history
      historyContainer.innerHTML = "";

      searchHistory.forEach((city) => {
        const cityElement = document.createElement("a");
        cityElement.textContent = city;
        cityElement.classList.add("list-group-item");
        cityElement.href = "#";
        historyContainer.appendChild(cityElement);

        // Add click event listener to each city element
        cityElement.addEventListener("click", function () {
          // Call the function to show weather for the selected city
          showWeather(city);
        });
      });
    }
    function showWeather(city) {
      const API_URL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

      // Retrieve geographical coordinates given a city name
      $.get(API_URL, function (data) {
        console.log(data); // control step
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        const API_URL_COORD = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        // Retrieve required weather data from API
        $.get(API_URL_COORD, function (coordData) {
          console.log(coordData); // control step
          const cityName = coordData.name;
          const date = new Date();
          const weatherIcon = `http://openweathermap.org/img/wn/${coordData.weather[0].icon}@2x.png`;
          const temperature = coordData.main.temp;
          const humidity = coordData.main.humidity;
          const windSpeed = coordData.wind.speed;
          console.log(
            cityName,
            date,
            weatherIcon,
            temperature,
            humidity,
            windSpeed
          ); // control step

          // Update the HTML elements with the weather data from API retrieved in the previous step
          document.getElementById("city-name").textContent = cityName;
          document.getElementById(
            "date"
          ).textContent = `( ${date.toDateString()} )`;
          document.getElementById("weather-icon").src = weatherIcon;
          document.getElementById(
            "temperature"
          ).textContent = `Temperature: ${temperature}°C`;
          document.getElementById(
            "humidity"
          ).textContent = `Humidity: ${humidity}%`;
          document.getElementById(
            "wind-speed"
          ).textContent = `Wind Speed: ${windSpeed} mph`;

          // Forecast data fetch from API
          const API_URL_FORECAST = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
          $.get(API_URL_FORECAST, function (forecastData) {
            console.log(forecastData); // control step
            // Loop to retrieve data for 5 days weather forecast from API
            for (let i = 7; i < forecastData.list.length; i += 8) {
              const forecast = forecastData.list[i];
              const forecastDate = new Date(forecast.dt * 1000);
              const forecastWeatherIcon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
              const forecastTemperature = forecast.main.temp;
              const forecastHumidity = forecast.main.humidity;
              const forecastWind = forecast.wind.speed;
              console.log(
                forecastDate,
                forecastWeatherIcon,
                forecastTemperature,
                forecastHumidity
              ); // control step
              // Update the HTML elements with the forecast data
              switch (i) {
                case 7:
                  $("#day1-date").text(`${forecastDate.toDateString()}`);
                  $("#day1-icon").attr("src", forecastWeatherIcon);
                  $("#day1-temp").text(
                    "Temperature: " + forecastTemperature + "°C"
                  );
                  $("#day1-hum").text("Humidity: " + forecastHumidity + "%");
                  $("#day1-wind").text("Wind speed: " + forecastWind + "m/s");
                  break;
                case 15:
                  $("#day2-date").text(`${forecastDate.toDateString()}`);
                  $("#day2-icon").attr("src", forecastWeatherIcon);
                  $("#day2-temp").text(
                    "Temperature: " + forecastTemperature + "°C"
                  );
                  $("#day2-hum").text("Humidity: " + forecastHumidity + "%");
                  $("#day2-wind").text("Wind speed: " + forecastWind + "m/s");
                  break;
                case 23:
                  $("#day3-date").text(`${forecastDate.toDateString()}`);
                  $("#day3-icon").attr("src", forecastWeatherIcon);
                  $("#day3-temp").text(
                    "Temperature: " + forecastTemperature + "°C"
                  );
                  $("#day3-hum").text("Humidity: " + forecastHumidity + "%");
                  $("#day3-wind").text("Wind speed: " + forecastWind + "m/s");
                  break;
                case 31:
                  $("#day4-date").text(`${forecastDate.toDateString()}`);
                  $("#day4-icon").attr("src", forecastWeatherIcon);
                  $("#day4-temp").text(
                    "Temperature: " + forecastTemperature + "°C"
                  );
                  $("#day4-hum").text("Humidity: " + forecastHumidity + "%");
                  $("#day4-wind").text("Wind speed: " + forecastWind + "m/s");
                  break;
                case 39:
                  $("#day5-date").text(`${forecastDate.toDateString()}`);
                  $("#day5-icon").attr("src", forecastWeatherIcon);
                  $("#day5-temp").text(
                    "Temperature: " + forecastTemperature + "°C"
                  );
                  $("#day5-hum").text("Humidity: " + forecastHumidity + "%");
                  $("#day5-wind").text("Wind speed: " + forecastWind + "m/s");
                  break;
              }
            }
            // Extract the necessary data from the API response and update the UI
          }).fail(function () {
            console.error(
              "An error occurred while fetching the 5-day forecast data"
            );
            // Handle the error and show an appropriate message to the user
          });
        }).fail(function () {
          console.error(
            "An error occurred while fetching the weather data based on coordinates"
          );
          // Handle the error and show an appropriate message to the user
        });
      }).fail(function () {
        console.error("An error occurred while fetching the weather data");
        // Handle the error and show an appropriate message to the user
      });
    }
  });
});
