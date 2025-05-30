import React, { useState } from "react";
import "./Main.css";
import Card from "./card";
const API_KEY = "9f2e1f455e003246d00a9c41b725bbc8";

const Main = () => {
  const [city, setcity] = useState("");
  const [CurrentWeather, setCurrentWeather] = useState(null);
  const [forecast, setforecast] = useState([]);

  const kelvinToCelsius = (k) => (k - 273.15).toFixed(2);

  const fetchWeather = async (cityName, lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const data = await res.json();
      const uniqueDays = [];
      const fiveDayForecast = data.list.filter((forecast) => {
        const date = new Date(forecast.dt_txt).getDate();
        if (!uniqueDays.includes(date)) {
          uniqueDays.push(date);
          return true;
        }
        return false;
      });
      setCurrentWeather({ city: cityName, ...fiveDayForecast[0] });
      setforecast(fiveDayForecast.slice(1));
    } catch (err) {
      alert("Falied to fetch weather data.");
    }
  };

  const fetchCityCoordinates = async () => {
    if (!city.trim()) return;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      const data = await res.json();
      if (!data.length) return alert("city not found");
      const { lat, lon, name } = data[0];
      fetchWeather(name, lat, lon);
    } catch (err) {
      alert("Error fetching city coordinates.");
    }
  };
  const fetchUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${coords.latitude}&lon=${coords.longitude}&limit=1&appid=${API_KEY}`
          );
          const data = await res.json();
          const { name } = data[0];
          fetchWeather(name, coords.latitude, coords.longitude);
        } catch (err) {
          alert("Failed to fetch location");
        }
      },
      (error) => {
        alert("Location access denied.");
      }
    );
  };

  return (
    <>
      <div className="container">
        <div className="weather-input">
          <h3>Enter A City</h3>
          <input
            type="text"
            placeholder="Delhi, Kolkata, Vardman....."
            value={city}
            onChange={(e) => setcity(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && fetchCityCoordinates()}
          />
          <button className="search-btn" onClick={fetchCityCoordinates}>
            Search
          </button>
          <div className="separtor"></div>
          <button className="location-btn" onClick={fetchUserCoordinates}>
            Use Currect loactaion
          </button>
        </div>

        <div className="weather-data">
          <div className="current-weather">
            {CurrentWeather ? (
              <div className="detials">
                <h2>
                  {CurrentWeather.city}({CurrentWeather.dt_txt.split(" ")[0]})
                </h2>
                <h6>
                  Temperature:{kelvinToCelsius(CurrentWeather.main.temp)}°C
                </h6>
                <h6>Wind: {CurrentWeather.wind.speed} M/S</h6>
                <h6>Humidity: {CurrentWeather.main.humidity}%</h6>
              </div>
            ) : (
              <div className="details">
                <h2>_______ ( ______ )</h2>
                <h6>Temperature: __°C</h6>
                <h6>Wind: __ M/S</h6>
                <h6>Humidity: __%</h6>
              </div>
            )}
          </div>

          <div class="days-forecast">
            <h2>5-Day Forecast</h2>
            <ul class="weather-cards">
              {forecast.map((item, idx) => (
                <Card key={idx} data={item} />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <script
        defer=""
        src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015"
        integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ=="
        data-cf-beacon='{"rayId":"8962a3b16da53fbb","r":1,"version":"2024.4.1","token":"e029c4a3c1704e88ab37ce2409fd73de"}'
        crossorigin="anonymous"
      ></script>
    </>
  );
};

export default Main;
