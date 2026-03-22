let currentCity = '';

document.getElementById('cityInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') fetchWeather();
});

async function fetchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) return;
    currentCity = city;

    document.getElementById('errorMsg').style.display = 'none';
    document.getElementById('weatherCard').style.display = 'none';
    document.getElementById('forecastSection').style.display = 'none';
    document.getElementById('loading').style.display = 'block';

    try {
        const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        const data = await res.json();

        if (!res.ok) {
            showError(data.detail || 'Something went wrong.');
            return;
        }

        renderWeather(data);
    } catch (e) {
        showError('Could not connect to the server.');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function renderWeather(data) {
    const c = data.current;
    document.getElementById('cityName').textContent = data.city;
    document.getElementById('cityCountry').textContent = data.country;
    document.getElementById('cityDatetime').innerHTML = data.datetime.replace(' | ', '<br/>');
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${c.icon}@2x.png`;
    document.getElementById('tempVal').innerHTML = `${c.temp}<span class="temp-unit">°C</span>`;
    document.getElementById('weatherDesc').textContent = c.description;
    document.getElementById('feelsLike').textContent = `Feels like ${c.feels_like}°C`;
    document.getElementById('humidity').innerHTML = `${c.humidity}<span class="stat-unit"> %</span>`;
    document.getElementById('windSpeed').innerHTML = `${c.wind_speed}<span class="stat-unit"> km/h</span>`;
    document.getElementById('pressure').innerHTML = `${c.pressure}<span class="stat-unit"> hPa</span>`;
    document.getElementById('visibility').innerHTML = `${c.visibility}<span class="stat-unit"> km</span>`;

    // Forecast
    const grid = document.getElementById('forecastGrid');
    grid.innerHTML = '';
    data.forecast.forEach(day => {
        grid.innerHTML += `
            <div class="forecast-card">
            <div class="forecast-day">${day.date}</div>
            <img class="forecast-icon" src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt=""/>
            <div class="forecast-desc">${day.description}</div>
            <div class="forecast-temps">
            <span class="f-temp-high">${day.temp_max}°</span>
            <span class="f-temp-low">${day.temp_min}°</span>
            </div>
            </div>`;
        });

    document.getElementById('weatherCard').style.display = 'block';
    document.getElementById('forecastSection').style.display = 'block';

    document.getElementById('downloadBtn').onclick = () => {
        window.location.href = `/api/download?city=${encodeURIComponent(currentCity)}`;
    };
}

function showError(msg) {
    const el = document.getElementById('errorMsg');
    el.textContent = '⚠ ' + msg;
    el.style.display = 'block';
}

let lastScrollTop = 0;
const searchBar = document.querySelector('.search-bar');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        // Downscroll
        searchBar.style.transform = 'translateY(100%)';
    } else {
        // Upscroll
        searchBar.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
});
