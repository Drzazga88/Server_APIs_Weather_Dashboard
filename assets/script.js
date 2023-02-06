var API_Key = "5111297b359fd6c2201ce081633e2699";
var API_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_Key}&units=metric`;

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
    const date = new Date ();
    const weather = weatherData.weather[0];
    const weatherIcon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    const temperature = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    
    // Update the HTML to display the information
    document.getElementById("city-name").textContent = cityName;
    document.getElementById("date").textContent = date.toDateString();
    document.getElementById("weather-icon").src = weatherIcon;
    document.getElementById("temperature").textContent = `Temperature: ${temperature}°C`;
    document.getElementById("humidity").textContent = `Humidity: ${humidity}%`;
    document.getElementById("wind-speed").textContent = `Wind Speed: ${windSpeed} mph`;
  })
  .fail((error) => {
    console.error(`Error retrieving weather data: ${error}`);
  });
};

$(document).ready(function () {
    $("form").submit(function (event) {
      event.preventDefault();
      const city = $("#search-input").val();
      displayWeather(city);
    });
  });
  
  const displaySearchHistory = (searchHistory) => {
    // Get a reference to the container for the search history
    const historyContainer = document.querySelector("#history");
  
    // Clear any existing search history from the container
    historyContainer.innerHTML = "";
  
    // Loop over each item in the search history
    for (const city of searchHistory) {
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

  