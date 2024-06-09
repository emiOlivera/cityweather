import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const countryCodes = {
  'Argentina': 'AR',
  'Brazil': 'BR',
  'Peru': 'PE',
  'Ecuador': 'EC',
  'Venezuela': 'VE',
  'Chile': 'CL',
  'Uruguay': 'UY',
  'Paraguay': 'PY',
  'Colombia': 'CO',
  'Bolivia': 'BO'
};

const Ciudades = () => {
  const { country: countryParam } = useParams();
  const [ciudades, setCiudades] = useState([]);
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState([]);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCiudades = async () => {
      setLoading(true);
      try {
        const countryCode = countryCodes[countryParam];
        if (!countryCode) {
          throw new Error(`Abreviatura no encontrada para el país: ${countryParam}`);
        }
        
        const response = await axios.get(`https://secure.geonames.org/searchJSON?country=${countryCode}&maxRows=500&username=emiliano`);
        
        const ciudadesData = response.data.geonames.map(city => ({
          name: city.name,
          lat: city.lat,
          lng: city.lng
        }));
        
        setCiudades(ciudadesData);
        setCiudadesFiltradas(ciudadesData);
      } catch (error) {
        setError('Error al obtener los datos de las ciudades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCiudades();
  }, [countryParam]);

  const cambioCiudad = (e) => {
    const ciudadSeleccionada = e.target.value;
    setCiudadSeleccionada(ciudadSeleccionada);
  };

  const funcionBusqueda = (e) => {
    const query = e.target.value;
    setBusqueda(query);
    filterCiudades(query);
  };

  const filterCiudades = (query) => {
    const filtered = ciudades.filter(city =>
      city.name.toLowerCase().includes(query.toLowerCase())
    );
    setCiudadesFiltradas(filtered);
  };

  const verClima = () => {
    if (ciudadSeleccionada) {
      const ciudad = ciudades.find(city => city.name === ciudadSeleccionada);
      if (ciudad) {
        const { lat, lng } = ciudad;
        navigate(`/weather/${lat}/${lng}`);
      }
    }
  };

  return (
    <div className='city-container'>
      <h2>Selecciona una ciudad de {countryParam}</h2>
      <div className='city-input'>
        <input 
          type="text" 
          placeholder="Buscar ciudad" 
          value={busqueda} 
          onChange={funcionBusqueda} 
        />
      </div>
      {loading ? (
        <div className='loading-spinner'>
          Cargando...   <FaSpinner className='spinner' style={{fontSize: "25px", color:"rgb(0, 187, 255)"}}/>
        </div>
      ) : (
        ciudadesFiltradas.length > 0 && (
          <div className='city-select'> 
            <select value={ciudadSeleccionada} onChange={cambioCiudad}>
              <option value="">Selecciona una ciudad</option>
              {ciudadesFiltradas.sort().map((city, index) => (
                <option key={index} value={city.name}>{city.name}</option>
              ))}
            </select>
          </div>
        )
      )}
      <div className='city-button'>
        <button onClick={verClima}>Ver clima</button>
      </div>
    </div>
  );
};

export default Ciudades;



