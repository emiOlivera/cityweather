import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import img1 from '../viento.png';
import img2 from '../amanecer.png';

const Weather = () => {
  const { lat, lng } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [diasProximos, setDiasProximos] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&lang=es&units=metric&appid=c8daf74f0e1e53677d69c5935fdc981e`);
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    
    const fetchDiasProximos = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&lang=es&units=metric&appid=c8daf74f0e1e53677d69c5935fdc981e`);
        setDiasProximos(response.data.list);
      } catch (error) {
        console.error('Error fetching daily forecast:', error);
      }
    };
    
    fetchWeather();
    fetchDiasProximos();
  }, [lat, lng]);

  return (
    <div>
      {weatherData && diasProximos ? (
        <div className='weather-container'>
          <h2>Clima en: {weatherData.name}</h2>
          {weatherData.weather.map((condition) => (
            <div key={condition.id} className='clima'>
              <p>{condition.description.toUpperCase()}</p>
              <img src={`https://openweathermap.org/img/wn/${condition.icon}.png`} alt={condition.description} className='logo'/>
            </div>
          ))}
          <div className='p-container'>
            <p>Temperatura: {weatherData.main.temp} °C</p>
            <p>Humedad: {weatherData.main.humidity}%</p>
            <p>Presión atmosférica: {weatherData.main.pressure} hPa</p>
          </div>
          <div className='viento'>
            <p>Velocidad del viento: {weatherData.wind.speed} m/s</p>
            <img src={img1} alt="Viento" />
            <p>Dirección del viento: {weatherData.wind.deg}°</p>
          </div>
          <div className='amanecer'>
            <p>Amanecer: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
            <img src={img2} alt="Amanecer" />
            <p>Atardecer: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
          </div>
          <h3>Próximos días:</h3>
          <div className='proximos'>
            {diasProximos && Object.values(
              diasProximos.reduce((acc, forecast) => {
                const date = new Date(forecast.dt * 1000).toLocaleDateString();
                if (!acc[date]) {
                  acc[date] = forecast;
                } else {
                  // Si ya existe un registro para este día, actualiza los datos si es necesario
                  if (forecast.main.temp_min < acc[date].main.temp_min) {
                    acc[date].main.temp_min = forecast.main.temp_min;
                  }
                  if (forecast.main.temp_max > acc[date].main.temp_max) {
                    acc[date].main.temp_max = forecast.main.temp_max;
                  }
                }
                return acc;
              }, {})
            ).slice(1, 7).map((day) => (
              <div key={day.dt} className='proximos-item'>
                <p>Fecha: {new Date(day.dt * 1000).toLocaleDateString()}</p>
                <p>Temp Min: {day.main.temp_min} °C</p>
                <p>Temp Max: {day.main.temp_max} °C</p>
                <p>Clima: {day.weather[0].description}</p>
                <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt={day.weather[0].description} className='logo'/>
              </div>
            ))}
          </div>
          <Link to="/" className="btn btn-primary">Volver a la página de inicio</Link>
        </div>
      ) : (
        <div className='notFound'>
          <h4>Su clima se esta generando. Espere.</h4>
          <Link to="/" className="btn">Volver a la página de inicio</Link>
        </div>
      )}
    </div>
  );
}

export default Weather;
