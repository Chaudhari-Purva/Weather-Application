const API_KEY = "1c818f73d8092ce2f9d507fc664699a1";

const cities = [
  "Delhi","Mumbai","Pune","Nagpur","Bangalore",
  "Hyderabad","Chennai","Kolkata","Jaipur","Ahmedabad",
  "Indore","Bhopal","Surat","Noida","Chandigarh"
];

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

searchBtn.onclick = () => handleSearch();
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") handleSearch();
});

function handleSearch() {
  const city = searchInput.value.trim();
  if (!city) return;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      updateMainCard(data);
      searchInput.value = "";
    });
}


const carousel = document.getElementById("cityCarousel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const CARD_WIDTH = 190;     // card + margin
const CARDS_PER_VIEW = 5;

let currentPage = 0;
let totalPages = Math.ceil(cities.length / CARDS_PER_VIEW);

/* Load all 15 city cards */
cities.forEach(city => loadCityWeather(city));

function loadCityWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => createCityCard(data));
}

function createCityCard(data) {
  const card = document.createElement("div");
  card.className = "city-card";

  card.innerHTML = `
    <h4>${data.name}</h4>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
    <p>${Math.round(data.main.temp)}°C</p>
    <small>${data.weather[0].main}</small>
  `;

  card.onclick = () => updateMainCard(data);
  carousel.appendChild(card);
}

/* Pagination buttons */
nextBtn.onclick = () => {
  if (currentPage < totalPages - 1) {
    currentPage++;
    slideCarousel();
  }
};

prevBtn.onclick = () => {
  if (currentPage > 0) {
    currentPage--;
    slideCarousel();
  }
};

function slideCarousel() {
  const offset = currentPage * CARDS_PER_VIEW * CARD_WIDTH;
  carousel.style.transform = `translateX(-${offset}px)`;
}

/* Update Main Card + Background */
function updateMainCard(data) {
  mainTemp.textContent = `${Math.round(data.main.temp)}°C`;
  mainCity.textContent = data.name;
  mainDesc.textContent = data.weather[0].description;

  humidityEl.textContent = data.main.humidity;
  windEl.textContent = data.wind.speed;

  mainIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  updateBackground(data);
}


/* Background Logic */
function updateBackground(data) {
  const condition = data.weather[0].main;
  const hour = new Date().getHours();

  let bg;
  if (hour >= 19 || hour <= 5)
    bg = "#141E30,#243B55";            // Night
  else if (condition === "Clear")
    bg = "#f7971e,#ffd200";             // Sunny
  else if (condition === "Clouds")
    bg = "#bdc3c7,#2c3e50";             // Cloudy
  else if (condition === "Rain")
    bg = "#43cea2,#185a9d";             // Rain
  else if (condition === "Thunderstorm")
    bg = "#232526,#414345";             // Storm
  else if (data.main.temp < 10)
    bg = "#83a4d4,#b6fbff";             // Cold
  else
    bg = "#74ebd5,#acb6e5";

  document.body.style.background = `linear-gradient(135deg,${bg})`;
}