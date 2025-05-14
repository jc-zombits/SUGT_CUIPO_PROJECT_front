import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <Menu mode="horizontal" theme="dark" style={{ backgroundColor: '#1f1f1f' }}>
            <Menu.Item key="home">
                <Link to="/cuipo">Home</Link>
            </Menu.Item>
            <Menu.Item key="proyectos">
                <Link to="/cuipo/proyectos">Proyectos</Link>
            </Menu.Item>
            <Menu.Item key="dependencias">
                <Link to="/cuipo/dependencias">Dependencias</Link>
            </Menu.Item>
            <Menu.Item key="terceros">
                <Link to="/cuipo/terceros">Terceros</Link>
            </Menu.Item>
            <Menu.Item key="cuipo">
                <Link to="/cuipo/form">CUIPO</Link>
            </Menu.Item>
        </Menu>
    );
};

export default Navbar;
