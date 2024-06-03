const API_KEY = '168d15b143d90cc0e04e457f424d97e2';

const cityForm = document.getElementById('cityForm');
const cityInput = document.getElementById('cityInput');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('searchHistory');

// Retrieve search history from local storage
let searchHistoryData = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Render search history on page load
renderSearchHistory();

cityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeather(cityName);
        cityInput.value = '';
    }
});

searchHistory.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        const cityName = e.target.textContent;
        getWeather(cityName);
    }
});

async function getWeather(cityName) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    displayWeather(data);
    addToSearchHistory(cityName);
}

function displayWeather(data) {
    // Display current weather
    currentWeather.innerHTML = `
        <h2>${data.name}</h2>
        <p>Date: ${new Date(data.dt * 1000).toLocaleDateString()}</p>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
        <p>Temperature: ${data.main.temp} &#8451;</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;

    // Display 5-day forecast
    forecast.innerHTML = ''; // Clear previous forecast
    getForecast(data.coord.lat, data.coord.lon);
}

async function getForecast(lat, lon) {
    const apiKey = '168d15b143d90cc0e04e457f424d97e2';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data.list);
        })
        .catch(error => {
            console.error('There was a problem fetching the forecast data:', error);
        });
}

function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    // Create an object to store forecasts by date
    const forecastByDate = {};

    // Iterate over forecastData and group forecasts by date
    forecastData.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        if (!forecastByDate[date]) {
            forecastByDate[date] = forecast;
        }
    });

    // Iterate over forecastByDate and create HTML elements for each forecast
    Object.values(forecastByDate).forEach(forecast => {
        // Create elements to display forecast data
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <p>Date: ${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
            <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
            <p>Temperature: ${forecast.main.temp} &#8451;</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
            <p>Wind Speed: ${forecast.wind.speed} m/s</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}

// Function to add a city to the search history
function addToSearchHistory(cityName) {
    // Check if the city already exists in the search history
    if (!searchHistoryData.includes(cityName)) {
        searchHistoryData.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistoryData));
        renderSearchHistory();
    }
}

// Function to render search history on the page
function renderSearchHistory() {
    searchHistory.innerHTML = '';
    searchHistoryData.forEach(cityName => {
        const li = document.createElement('li');
        li.textContent = cityName;
        searchHistory.appendChild(li);
    });
}