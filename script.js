const API_KEY = "a5080d6863670985b2f63ed6c8e1b3e2";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherCard = document.getElementById("weatherCard");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const country = document.getElementById("country");
const forecastSection = document.getElementById("forecastSection");
const forecastCards = document.getElementById("forecastCards");
const locationBtn = document.getElementById("locationBtn");
// Fetch Weather
async function getWeather(city) {

    weatherCard.classList.add("hidden");
    error.classList.add("hidden");
    loading.classList.remove("hidden");

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
}

        const data = await response.json();

        displayWeather(data);
        await getForecast(city);

    } catch (err) {

        error.textContent = err.message;
        error.classList.remove("hidden");

    } finally {

        loading.classList.add("hidden");

    }

}
async function getForecast(city) {

    const url =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
}

        const data = await response.json();

        displayForecast(data.list);

    } catch (err) {

        console.log(err);

    }

}
// Display Weather
function displayWeather(data) {

    cityName.textContent =
        `${data.name}, ${data.sys.country}`;

    temperature.textContent =
        `${data.main.temp} °C`;

    description.textContent =
        data.weather[0].description;

    humidity.textContent =
        `${data.main.humidity}%`;

    wind.textContent =
        `${data.wind.speed} m/s`;

    feelsLike.textContent =
        `${data.main.feels_like} °C`;

    country.textContent =
        data.sys.country;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherIcon.alt =
        data.weather[0].description;

    weatherCard.classList.remove("hidden");

}

// Button Click
searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {

        error.textContent = "Please enter a city name.";
        error.classList.remove("hidden");
        weatherCard.classList.add("hidden");
        return;

    }

    getWeather(city);

});

// Press Enter
cityInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        searchBtn.click();

    }

});
function getCurrentLocation() {

    if (!navigator.geolocation) {

        error.textContent =
            "Geolocation is not supported by your browser.";

        error.classList.remove("hidden");

        return;
    }

    loading.classList.remove("hidden");

    navigator.geolocation.getCurrentPosition(
        success,
        locationError
    );
}
async function success(position) {

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to fetch weather.");
        }

        const data = await response.json();

        displayWeather(data);

        // Optional: 5-day forecast by coordinates
        getForecastByCoords(latitude, longitude);

    } catch (err) {

        error.textContent = err.message;
        error.classList.remove("hidden");

    } finally {

        loading.classList.add("hidden");
    }
}
function locationError() {

    loading.classList.add("hidden");

    error.textContent =
        "Location access denied.";

    error.classList.remove("hidden");
}
async function getForecastByCoords(lat, lon) {

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        const data = await response.json();

        displayForecast(data.list);

    } catch (err) {

        console.log(err);
    }
}
locationBtn.addEventListener("click", getCurrentLocation);