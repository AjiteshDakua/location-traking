const address = document.querySelector(".address");
const coordinates = document.querySelector(".coordinates");
const initialState = document.querySelector(".initial-state");
const detailsState = document.querySelector(".details-state");
const backBtn = document.querySelector(".back-btn");
const weatherInfo = document.querySelector(".weather-info");

// OpenCageData API key and endpoint
const opencageApiKey = "81d0f84c78dc49bdaf5495f363046b6c";
const opencageApiEndpoint = "https://api.opencagedata.com/geocode/v1/json";

// OpenWeather API key and endpoint
const openWeatherApiKey = "f35c7169185993b34b1b28c08abe37be"; // Replace with your OpenWeather API key
const openWeatherApiEndpoint =
  "https://api.openweathermap.org/data/2.5/weather";

// Function to fetch the user's current address using OpenCageData API
const getUserCurrentAddress = async (latitude, longitude) => {
  const query = `${latitude},${longitude}`;
  const apiUrl = `${opencageApiEndpoint}?key=${opencageApiKey}&q=${query}&pretty=1`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const formattedData = data.results[0].formatted;
    address.textContent = `Address: ${formattedData}`;
    coordinates.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
    getWeatherInfo(latitude, longitude);
  } catch (error) {
    console.error(error);
    address.textContent = "Unable to retrieve address. Please try again.";
    coordinates.textContent = "";
  }
};

// Function to fetch the weather information using OpenWeather API

const setWeatherIcon = (description) => {
  let iconClass;
  switch (description.toLowerCase()) {
    case "clear":
      iconClass = "fas fa-sun";
      break;
    case "clouds":
      iconClass = "fas fa-cloud";
      break;
    case "drizzle":
      iconClass = "fas fa-cloud-rain";
      break;
    case "rain":
      iconClass = "fas fa-cloud-showers-heavy";
      break;
    case "snow":
      iconClass = "fas fa-snowflake";
      break;
    case "wind":
      iconClass = "fas fa-wind";
      break;
    case "humidity":
      iconClass = "fas fa-tint";
      break;
    default:
      iconClass = "fas fa-cloud-sun";
      break;
  }
  return iconClass;
};

const getWeatherInfo = async (latitude, longitude) => {
  const apiUrl = `${openWeatherApiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const temperature = data.main.temp;
    const description = data.weather[0].main; // Using main for simplified weather description
    const iconClass = setWeatherIcon(description);
    weatherInfo.innerHTML = `<i class="${iconClass}"></i> Current Weather: ${temperature}°C, ${description}`;
  } catch (error) {
    console.error(error);
    weatherInfo.innerHTML =
      "<i class='fas fa-exclamation-triangle'></i> Unable to retrieve weather information. Please try again.";
  }
};

// Event listener for the button click to get the user's current location
document.querySelector(".geo-btn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`${latitude}, ${longitude}`);
        getUserCurrentAddress(latitude, longitude);
        initialState.style.display = "none";
        detailsState.style.display = "block";
      },
      (error) => {
        console.error(error.message);
        address.textContent =
          "Unable to retrieve your location. Please check your browser settings.";
        coordinates.textContent = "";
      },
      { enableHighAccuracy: true }
    );
  } else {
    address.textContent = "Geolocation is not supported by your browser.";
    coordinates.textContent = "";
  }
});

// Event listener for the back button to return to the initial state
backBtn.addEventListener("click", () => {
  initialState.style.display = "block";
  detailsState.style.display = "none";
  address.textContent = "Address will appear here...";
  coordinates.textContent = "Latitude and Longitude will appear here...";
  weatherInfo.textContent = ""; // Clear the weather info
});

//weather icon
