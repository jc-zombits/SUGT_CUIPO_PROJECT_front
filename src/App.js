import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Proyectos from './components/Proyectos';
import Dependencias from './components/Dependencias';
import Terceros from './components/Terceros';
import FormPage from './components/FormPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/cuipo" element={<Home />} />
                <Route path="/cuipo/proyectos" element={<Proyectos />} />
                <Route path="/cuipo/dependencias" element={<Dependencias />} />
                <Route path="/cuipo/terceros" element={<Terceros />} />
                <Route path="/cuipo/form" element={<FormPage />} />
            </Routes>
        </Router>
    );
}

export default App;
