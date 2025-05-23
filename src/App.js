import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Proyectos from './components/Proyectos';
import Dependencias from './components/Dependencias';
import Terceros from './components/Terceros';
import FormPage from './components/FormPage';
import Ejecucion from './components/Ejecucion';

function App() {
    return (
        <Router>
            <Routes>
                {/* Redirección desde / a /cuipo */}
                <Route path="/" element={<Navigate to="/cuipo" />} />
                <Route path="/cuipo" element={<Home />} />
                <Route path="/cuipo/proyectos" element={<Proyectos />} />
                <Route path="/cuipo/dependencias" element={<Dependencias />} />
                <Route path="/cuipo/terceros" element={<Terceros />} />
                <Route path="/cuipo/form" element={<FormPage />} />
                <Route path="/cuipo/ejecucion-presu" element={<Ejecucion />} />
            </Routes>
        </Router>
    );
}

export default App;
