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
  const [provincias, setProvincias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const countryCode = countryCodes[countryParam];
        if (!countryCode) {
          throw new Error(`Abreviatura no encontrada para el país: ${countryParam}`);
        }
        
        const response = await axios.get(`https://secure.geonames.org/searchJSON?country=${countryCode}&featureCode=ADM1&username=emiliano`);
        
        const provinciasData = response.data.geonames.map(provincia => ({
          name: provincia.name,
          code: provincia.adminCode1
        }));
        
        setProvincias(provinciasData);
      } catch (error) {
        setError('Error al obtener los datos de las provincias:', error);
      }
    };

    fetchProvincias();
  }, [countryParam]);

  useEffect(() => {
    if (provinciaSeleccionada) {
      const fetchCiudades = async () => {
        setLoading(true);
        try {
          const countryCode = countryCodes[countryParam];
          if (!countryCode) {
            throw new Error(`Abreviatura no encontrada para el país: ${countryParam}`);
          }
          
          const response = await axios.get(`https://secure.geonames.org/searchJSON?country=${countryCode}&adminCode1=${provinciaSeleccionada}&maxRows=400&username=emiliano`);
          
          const ciudadesData = response.data.geonames.map(city => ({
            name: city.name,
            lat: city.lat,
            lng: city.lng
          }));

          const uniqueCities = Array.from(new Set(ciudadesData.map(city => city.name))).map(name => {
            return ciudadesData.find(city => city.name === name);
          });

          setCiudades(uniqueCities);
          setCiudadesFiltradas(uniqueCities);
        } catch (error) {
          setError('Error al obtener los datos de las ciudades:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCiudades();
    }
  }, [countryParam, provinciaSeleccionada]);

  const cambioProvincia = (e) => {
    const provinciaSeleccionada = e.target.value;
    setProvinciaSeleccionada(provinciaSeleccionada);
  };

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
    <>
    <div className='city-container'>
      <h2>Selecciona una provincia de {countryParam}</h2>
      <div className='city-select'>
        <select value={provinciaSeleccionada} onChange={cambioProvincia}>
          <option value="">Selecciona una provincia</option>
            {provincias.sort((a, b) => a.name.localeCompare(b.name)).map((provincia, index) => (
          <option key={index} value={provincia.code}>{provincia.name}</option>
            ))}
        </select>
      </div>
      {provinciaSeleccionada && (
        <>
          <h2>Selecciona una ciudad</h2>
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
                      {ciudadesFiltradas.sort((a, b) => a.name.localeCompare(b.name)).map((city, index) => (
                  <option key={index} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>
            )
          )}
          <div className='city-button'>
            <button onClick={verClima}>Ver clima</button>
          </div>
        </>
      )}
    </div>
    </>
  );
}  

export default Ciudades;





