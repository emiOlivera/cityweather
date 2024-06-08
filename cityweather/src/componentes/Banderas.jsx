import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Banderas = () => {
  const [paisesSeleccionados, setPaisesSeleccionados] = useState([]);
  const [ubicacion, setUbicacion] = useState(null);
  const navegacion = useNavigate();

  const usarUbicacion = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const { latitude, longitude } = position.coords;
        setUbicacion({ latitude, longitude });
        navegacion(`/location-weather/${latitude},${longitude}`);
      });
    } else {
      console.log("Geolocalización no está disponible en este navegador.");
    }
  };

  const paisDelSur = [
    'Argentina',
    'Brazil',
    'Peru',
    'Ecuador',
    'Venezuela',
    'Chile',
    'Uruguay',
    'Paraguay',
    'Colombia',
    'Bolivia'
  ];

  useEffect(() => {
    const fetchPaisesSeleccionados = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const paisesSeleccionados = response.data.filter(country =>
          paisDelSur.includes(country.name.common)
        );
        setPaisesSeleccionados(paisesSeleccionados);
      } catch (error) {
        console.error('Error fetching countries data:', error);
      }
    };

    fetchPaisesSeleccionados();
  }, []);

  return (
    <div className='flag-box'>
      <h2>Elija un país</h2>
      <div className='flag-container'>
        {paisesSeleccionados.map(country => (
          <div key={country.name.common} className='flag'>
            <Link to={`/choose-city/${country.name.common}`}>
              <img src={country.flags.svg} alt={country.name.common} />
            </Link>
          </div>
        ))}
      </div>
      <button onClick={usarUbicacion} className='location-btn'>Usar ubicación</button>
    </div>
  );
};

export default Banderas;