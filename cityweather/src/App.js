import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Banderas from "./componentes/Banderas"
import Ciudades from './componentes/Ciudades'
import Weather from './componentes/Weather';
import LocationWeather from './componentes/LocationWeather'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Banderas />} />
        <Route path="/choose-city/:country" element={<Ciudades />} />
        <Route path="/weather/:lat/:lng" element={<Weather />} />
        <Route path="/location-weather/:location" element={<LocationWeather />} />
      </Routes>
    </Router>
  );
};

export default App;
