/**
 * Weather Application
 * Fetches and displays weather data using OpenWeatherMap API
 */

// =============================================
// CONFIGURATION
// =============================================
const CONFIG = {
    API_KEY: "YOUR_API_KEY",
    API_BASE_URL: "https://api.openweathermap.org/data/2.5/weather",
    UNITS: "metric",
    SELECTORS: {
        WEATHER_RESULT: "#weatherResult",
        CITY_NAME: "#cityName",
        TEMPERATURE: "#temperature",
        CONDITION: "#condition",
        HUMIDITY: "#humidity",
        WIND_SPEED: "#windSpeed",
        CITY_INPUT: "#cityInput"
    }
};

// =============================================
// DOM UTILITIES
// =============================================
const DOM = {
    /**
     * Get element by ID
     * @param {string} selector - CSS selector or element ID
     * @returns {HTMLElement|null}
     */
    get: (selector) => document.querySelector(selector),

    /**
     * Show element by removing hidden class
     * @param {HTMLElement} element
     */
    show: (element) => element?.classList.remove("hidden"),

    /**
     * Hide element by adding hidden class
     * @param {HTMLElement} element
     */
    hide: (element) => element?.classList.add("hidden"),

    /**
     * Set text content of element
     * @param {string} selector
     * @param {string} text
     */
    setText: (selector, text) => {
        const element = DOM.get(selector);
        if (element) element.innerText = text;
    }
};

// =============================================
// WEATHER SERVICE
// =============================================
const WeatherService = {
    /**
     * Fetch weather by city name
     * @param {string} city - City name
     * @returns {Promise<Object>} Weather data
     */
    fetchByCity: (city) => {
        const url = `${CONFIG.API_BASE_URL}?q=${city}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`;
        return fetch(url).then(response => response.json());
    },

    /**
     * Fetch weather by coordinates
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {Promise<Object>} Weather data
     */
    fetchByCoordinates: (lat, lon) => {
        const url = `${CONFIG.API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`;
        return fetch(url).then(response => response.json());
    }
};

// =============================================
// WEATHER UI MANAGER
// =============================================
const WeatherUI = {
    /**
     * Display weather data on the page
     * @param {Object} data - Weather data from API
     */
    display: (data) => {
        DOM.show(DOM.get(CONFIG.SELECTORS.WEATHER_RESULT));
        DOM.setText(CONFIG.SELECTORS.CITY_NAME, data.name);
        DOM.setText(CONFIG.SELECTORS.TEMPERATURE, `Temperature: ${data.main.temp}°C`);
        DOM.setText(CONFIG.SELECTORS.CONDITION, `Condition: ${data.weather[0].description}`);
        DOM.setText(CONFIG.SELECTORS.HUMIDITY, `Humidity: ${data.main.humidity}%`);
        DOM.setText(CONFIG.SELECTORS.WIND_SPEED, `Wind Speed: ${data.wind.speed} m/s`);
    },

    /**
     * Show error message
     * @param {string} message
     */
    displayError: (message) => {
        alert(message);
        console.error("Weather Error:", message);
    }
};

// =============================================
// EVENT HANDLERS
// =============================================

/**
 * Handle weather search by city name
 */
function getWeatherByCity() {
    const city = DOM.get(CONFIG.SELECTORS.CITY_INPUT)?.value?.trim();

    if (!city) {
        WeatherUI.displayError("Please enter a city name.");
        return;
    }

    WeatherService.fetchByCity(city)
        .then(data => WeatherUI.display(data))
        .catch(error => WeatherUI.displayError("City not found! Please try again."));
}

/**
 * Handle weather search by geolocation
 */
function getWeatherByLocation() {
    if (!navigator.geolocation) {
        WeatherUI.displayError("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            WeatherService.fetchByCoordinates(latitude, longitude)
                .then(data => WeatherUI.display(data))
                .catch(error => WeatherUI.displayError("Unable to fetch weather for your location."));
        },
        (error) => WeatherUI.displayError("Location access denied or unavailable.")
    );
}