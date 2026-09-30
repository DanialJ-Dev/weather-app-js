import { showErrorModal } from "./modal.js";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "b6b310b99352bff99f3826a26a71ceb5";

const getWeatherData = async (type, data) => {
  let url = null;

  switch (type) {
    case "current":
      if (typeof data === "string") {
        url = `${BASE_URL}/weather?q=${data}&appid=${API_KEY}&units=metric&lang=fa`;
      } else {
        url = `${BASE_URL}/weather?lat=${data.latitude}&lon=${data.longitude}&appid=${API_KEY}&units=metric&lang=fa`;
      }
      break;
    case "forecast":
      if (typeof data === "string") {
        url = `${BASE_URL}/forecast?q=${data}&appid=${API_KEY}&units=metric&lang=fa`;
      } else {
        url = `${BASE_URL}/forecast?lat=${data.latitude}&lon=${data.longitude}&appid=${API_KEY}&units=metric&lang=fa`;
      }
      break;
    default:
      url = `${BASE_URL}/weather?q=rasht&appid=${API_KEY}&units=metric&lang=fa`;
      break;
  }

  try {
    const response = await fetch(url);
    const json = await response.json();
    if (+json.cod === 200) {
      return json;
    } else {
      showErrorModal(json.message);
    }
  } catch (error) {
    showErrorModal("An error occured when fetching data.");
  }
};

export default getWeatherData;
