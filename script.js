const API_KEY = '8f798dce3e134410ce39e302d4acfe04';

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const currentWeather = document.getElementById('currentWeather');
const weatherInfo = document.getElementById('weatherInfo');

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

// Map weather description to custom icon path
function getCustomIcon(description) {
  const desc = description.toLowerCase();

  if (desc.includes('moderate rain')) return './source/icons/moderate_rain.png';
  if (desc.includes('light rain')) return './source/icons/light_rain.png';
  if (desc.includes('rain')) return './source/icons/moderate_rain.png';
  if (desc.includes('thunderstorm')) return './source/icons/thunderstorm.png';
  if (desc.includes('cloud')) return './source/icons/cloudy.png';
  if (desc.includes('clear')) return './source/icons/clear.png';
  if (desc.includes('snow')) return './source/icons/snow.png';

  return './source/icons/default.png';
}

// Fetch weather from OpenWeather API
function fetchWeather(city) {
  currentWeather.innerHTML = '';
  weatherInfo.innerHTML = '<p>Loading...</p>';

  axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => {
      const list = res.data.list;

      // ----- Current Weather -----
      const today = list[0];
      const date = new Date(today.dt_txt).toDateString();
      const temp = Math.round(today.main.temp);
      const desc = today.weather[0].description;
      const humidity = today.main.humidity;
      const wind = today.wind.speed;
      const iconPath = getCustomIcon(desc);

      currentWeather.innerHTML = `
        <div class="current-card">
          <h2>Current Weather</h2>
          <h3>${res.data.city.name} — ${date}</h3>
          <img src="${iconPath}" alt="${desc}" class="large-icon" />
          <p><strong>${desc}</strong></p>
          <div class="data-icons">
            <div><img src="./source/icons/temp.png" alt="temp" /> <span>${temp}°C</span></div>
            <div><img src="./source/icons/humidity.png" alt="humidity" /> <span>${humidity}%</span></div>
            <div><img src="./source/icons/wind.png" alt="wind" /> <span>${wind} m/s</span></div>
          </div>
        </div>
      `;

      // ----- Forecast -----
      weatherInfo.innerHTML = '';
      for (let i = 8; i < list.length; i += 8) {
        const item = list[i];
        const date = new Date(item.dt_txt).toDateString();
        const temp = Math.round(item.main.temp);
        const desc = item.weather[0].description;
        const humidity = item.main.humidity;
        const wind = item.wind.speed;
        const icon = getCustomIcon(desc);

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h3>${date}</h3>
          <img src="${icon}" alt="${desc}">
          <p><strong>${desc}</strong></p>
          <div class="data-icons small">
            <div><img src="./source/icons/temp.png" alt="temp" /> <span>${temp}°C</span></div>
            <div><img src="./source/icons/humidity.png" alt="humidity" /> <span>${humidity}%</span></div>
            <div><img src="./source/icons/wind.png" alt="wind" /> <span>${wind} m/s</span></div>
          </div>
        `;
        weatherInfo.appendChild(card);
      }
    })
    .catch(() => {
      currentWeather.innerHTML = '';
      weatherInfo.innerHTML = `<p style="color: #f88;">City not found!</p>`;
    });
}
