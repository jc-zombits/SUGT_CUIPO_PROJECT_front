import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Proyectos from './components/Proyectos';
import Dependencias from './components/Dependencias';
import CuipoForm from './components/FormPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/cuipo" element={<Home />} />
        <Route path="/cuipo/proyectos" element={<Proyectos />} />
        <Route path="/cuipo/dependencias" element={<Dependencias />} />
        <Route path="/cuipo/form" element={<CuipoForm />} />
      </Routes>
    </>
  );
}

export default App;
