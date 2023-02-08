var API_Key = "5111297b359fd6c2201ce081633e2699";
var API_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_Key}&units=metric`;
var API_URL_FORECAST = `https://api.openweathermap.org/data/2.5/forecast?appid=${API_Key}&units=metric`;

// Current day weather
const getWeather = (city) => {
  return $.ajax({
    url: `${API_URL}&q=${city}`,
    method: "GET",
  });
};

const displayWeather = (city) => {
  // Get the current search history from local storage
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Add the current search to the history
  searchHistory.push(city);

  // Store the updated search history in local storage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

  getWeather(city)
    .done((weatherData) => {
      const cityName = weatherData.name;
      const date = new Date();
      const weatherIcon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
      const temperature = weatherData.main.temp;
      const humidity = weatherData.main.humidity;
      const windSpeed = weatherData.wind.speed;

      // Update the HTML to display the information
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
    })
    .fail((error) => {
      console.error(`Error retrieving weather data: ${error}`);
    });
};

// Add user input for the city
$(document).ready(function () {
  $("form").submit(function (event) {
    event.preventDefault();
    const city = $("#search-input").val();
    displayWeather(city);
  });
});

// Data for 5 days forecast
const getForecast = (city) => {
  return $.ajax({
    url: `${API_URL_FORECAST}&q=${city}`,
    method: "GET",
  });
};

// const dateOne = moment().add(1, 'days').format('L');
// document.querySelector("#day1-date").innerHTML = dateOne;
$("form").submit(function (event) {
    event.preventDefault();
    const city = $("#search-input").val();
    displayWeather(city);

// Call the API and retrieve the data
fetch(
  `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_Key}`
)
  .then((response) => response.json())
  .then((data) => {
    // Populate the values for the 5-day forecast
    console.error("Data from API: ", data);
    for (let i = 1; i <= 5; i++) {
      const forecast = data.list[i];
      console.log("Forecast data: ", forecast);
      document.querySelector(`#day${i}-date`).innerHTML = new Date(forecast.dt * 1000).toDateString();
      document.querySelector(`#day${i}-icon`).src = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
      document.querySelector(`#day${i}-temp`).innerHTML = `Temperature: ${forecast.main.temp} °C`;
      document.querySelector(`#day${i}-hum`).innerHTML = `Humidity: ${forecast.main.humidity}%`;
      document.querySelector(`#day${i}-wind`).innerHTML = `Wind Speed: ${forecast.wind.speed} m/s`;
    }
  })
  .catch((error) => console.error(error));
});

const displaySearchHistory = (searchHistory) => {
  // A reference for the search history
  const historyContainer = document.querySelector("#history");

  // Clear any existing search history from the history
  historyContainer.innerHTML = "";

  // Only show the last 5 items in the search history
  const limitedHistory = searchHistory.slice(-5);

  // Loop over each item in the search history
  for (const city of limitedHistory) {
    // Create a new HTML element for the city
    const cityElement = document.createElement("a");
    cityElement.textContent = city;
    cityElement.classList.add("list-group-item");
    cityElement.href = "#";

    // Add an event listener to the city element to display the weather when it's clicked
    cityElement.addEventListener("click", () => {
      displayWeather(city);
    });

    // Append the city element to the history container
    historyContainer.appendChild(cityElement);
  }
};
// Retrieve the search history from local storage
const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || []; //if the search history does not exist, an empty array is assigned
displaySearchHistory(searchHistory);