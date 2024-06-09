import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Venezuela from '../banderas/Venezuela.png';
import Argentina from '../banderas/Argentina.png';
import Colombia from '../banderas/Colombia.png';
import Chile from '../banderas/Chile.png';
import Paraguay from '../banderas/Paraguay.png';
import Uruguay from '../banderas/Uruguay.png';
import Brazil from '../banderas/Brazil.png';
import Bolivia from '../banderas/Bolivia.png';
import Ecuador from '../banderas/Ecuador.png';
import Peru from '../banderas/Peru.png';

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
    { name: 'Argentina', flag: Argentina },
    { name: 'Brazil', flag: Brazil },
    { name: 'Peru', flag: Peru },
    { name: 'Ecuador', flag: Ecuador },
    { name: 'Venezuela', flag: Venezuela },
    { name: 'Chile', flag: Chile },
    { name: 'Uruguay', flag: Uruguay },
    { name: 'Paraguay', flag: Paraguay },
    { name: 'Colombia', flag: Colombia },
    { name: 'Bolivia', flag: Bolivia }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setPaisesSeleccionados(paisDelSur);
  }, []);

  return (
    <>
    <div className='flag-box'>
      <h2>Elija un país</h2>
      <div className='flag-container'>
        {paisesSeleccionados.map(country => (
          <div key={country.name} className='flag'>
            <Link to={`/choose-city/${country.name}`}>
              <img src={country.flag} alt={country.name} />
            </Link>
          </div>
        ))}
      </div>
      <button onClick={usarUbicacion} className='location-btn'>Usar ubicación</button>
    </div>
    </>
  );
};

export default Banderas;

