import getWeatherData from "./utils/httpReq.js";
import {
  showErrorModal,
  showContactModal,
  removeModal,
} from "./utils/modal.js";
import { getWeekDay } from "./utils/customDate.js";

const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
const weatherContainer = document.getElementById("weather-content");
const forecastTitle = document.getElementById("forecast-title");
const forecastContainer = document.getElementById("forecast");
const locationIcon = document.getElementById("location");
const modalButtons = document.querySelectorAll(".modal-button");
const loader = document.getElementById("loader");
const contactButton = document.getElementById("contact");

const toFarsi = (str) => {
  return str.replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
};

const renderCurrentWeather = (data) => {
  if (!data) return;

  const weatherJSX = `
  <h1>${data.name}، ${data.sys.country}</h1>
  <div id="main">
  <div id="weather-icon-title"><img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="weather-icon" />
  <span>${data.weather[0].description}</span></div>
  <p>${toFarsi(Math.round(data.main.temp).toString())}° سانتی‌گراد</p>
  </div>
  <div id="info">
  <p>رطوبت: <span>٪${toFarsi(data.main.humidity.toString())}</span></p>
  <p>سرعت باد: <span>${toFarsi(data.wind.speed.toString())} متر/ثانیه</span></p>
  </div>`;

  weatherContainer.innerHTML = weatherJSX;
};

const renderForecast = (data) => {
  if (!data) return;
  forecastContainer.innerHTML = "";
  data = data.list.filter((obj) => obj.dt_txt.endsWith("12:00:00"));
  data.forEach((i) => {
    const forecastJSX = `
    <div>
    <img src="http://openweathermap.org/img/w/${i.weather[0].icon}.png" alt="weather-icon" />
    <h3>${getWeekDay(i.dt)}</h3>
    <p>${toFarsi(Math.round(i.main.temp).toString())}° سانتی‌گراد</p>
    <span>${i.weather[0].description}</span>
    </div>`;
    forecastContainer.innerHTML += forecastJSX;
  });
};

const searchHandler = async () => {
  const cityName = searchInput.value;

  if (!cityName) {
    showErrorModal("لطفا اسم شهر را وارد کنید.");
    return;
  }

  try {
    const previousWeather = weatherContainer.innerHTML;
    const previousForecast = forecastContainer.innerHTML;

    forecastTitle.style.display = "none";
    showLoader();

    const currentData = await getWeatherData("current", cityName);
    if (!currentData) {
      searchInput.value = "";
      loader.style.display = "none";
      forecastTitle.style.display = "block";
      weatherContainer.innerHTML = previousWeather;
      forecastContainer.innerHTML = previousForecast;
      return;
    } else {
      renderCurrentWeather(currentData);
      loader.style.display = "none";
    }

    const forecastData = await getWeatherData("forecast", cityName);
    forecastTitle.style.display = "block";
    renderForecast(forecastData);

    searchInput.value = "";
  } catch {
    loader.style.display = "none";
    showErrorModal("اتفاقی پیش آمده است.");
  }
};

const positionCallback = async (position) => {
  forecastTitle.style.display = "none";

  showLoader();

  const currentData = await getWeatherData("current", position.coords);
  const { lat, lon } = currentData.coord;
  localStorage.setItem("defaultLocation", JSON.stringify({ lat, lon }));
  renderCurrentWeather(currentData);
  loader.style.display = "none";

  const forecastData = await getWeatherData("forecast", position.coords);
  forecastTitle.style.display = "block";
  renderForecast(forecastData);
};

const errorCallback = (error) => {
  showErrorModal(error.message);
};

const locationHandler = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
    searchInput.value = "";
  } else {
    showErrorModal("مرورگر شما خدمات مکان‌یابی را پشتیبانی نمی‌کند.");
  }
};

const inithandler = async () => {
  forecastTitle.style.display = "none";
  const defaultCity = JSON.parse(localStorage.getItem("defaultLocation"));

  const location = defaultCity
    ? { latitude: defaultCity.lat, longitude: defaultCity.lon }
    : "tehran";

  const currentData = await getWeatherData("current", location);
  renderCurrentWeather(currentData);
  loader.style.display = "none";

  const forecastData = await getWeatherData("forecast", location);
  forecastTitle.style.display = "block";
  renderForecast(forecastData);
};

const showLoader = () => {
  loader.style.display = "inline-block";
  weatherContainer.innerHTML = "";
  forecastContainer.innerHTML = "";
};

searchButton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
contactButton.addEventListener("click", showContactModal);
modalButtons.forEach((button) => button.addEventListener("click", removeModal));
document.addEventListener("DOMContentLoaded", inithandler);
