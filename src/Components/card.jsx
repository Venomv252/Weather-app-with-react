import React from "react";

const Card = ({ data }) => {
  const kelvinToCelsius = (k) => (k - 273.15).toFixed(2);

  return (
    <li className="card">
      <h3>{data.dt_txt.split(" ")[0]}</h3>
      <img 
           src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
      alt="weather-icon" />
     <h6>Temp: {kelvinToCelsius(data.main.temp)}°C</h6>
     <h6>Wind: {data.wind.speed} M/S</h6>
     <h6>Humidity: {data.main.humidty}%</h6>
    
    </li>
  );
};

export default Card;
