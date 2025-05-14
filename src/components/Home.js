import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Typography, List, Spin } from 'antd';
import Navbar from './Navbar';

const { Title, Paragraph } = Typography;


const Home = () => {
    const [proyectos, setProyectos] = useState([]);
    const [loadingProyectos, setLoadingProyectos] = useState(true);
    const [fuentesCuipo, setFuentesCuipo] = useState([]);
    const [loadingFuentesCuipo, setLoadingFuentesCuipo] = useState(true);
    const [dependencias, setDependencias] = useState([]);
    const [loadingDependencias, setLoadingDependencias] = useState(true);
    const [catalogoProductos, setCatalogoProductos] = useState([]);
    const [loadingCatalogoProductos, setLoadingCatalogoProductos] = useState(true);

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/v1/cuipo/proyectos');
                const data = await response.json();
                setProyectos(data);
            } catch (error) {
                console.log('Error al cargar los proyectos:', error);
            } finally {
                setLoadingProyectos(false);
            }
        };

        fetchProyectos();
    }, []);

    useEffect(() => {
        const fetchFuentesCuipo = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/v1/cuipo/fuentes-cuipo');
                const data = await response.json();
                setFuentesCuipo(data);
            } catch (error) {
                console.log('Error al cargar los proyectos:', error);
            } finally {
                setLoadingFuentesCuipo(false);
            }
        };

        fetchFuentesCuipo();
    }, []);

    useEffect(() => {
        const fetchDependencias = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/v1/cuipo/dependencias');
                const data = await response.json();
                setDependencias(data);
            } catch (error) {
                console.log('Error al cargar los proyectos:', error);
            } finally {
                setLoadingDependencias(false);
            }
        };

        fetchDependencias();
    }, []);

    useEffect(() => {
        const fetchCatalogoProductos = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/v1/cuipo/catalogo-productos');
                const data = await response.json();
                setCatalogoProductos(data);
            } catch (error) {
                console.log('Error al cargar los proyectos:', error);
            } finally {
                setLoadingCatalogoProductos(false);
            }
        };

        fetchCatalogoProductos();
    }, []);

    return (
        <>
            <Navbar />
            <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
                <Title level={2} style={{ color: '#1890ff' }}>Bienvenido a Cuipo Project</Title>
                <Paragraph>Resumen del detalle de los datos</Paragraph>

                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={12}>
                        <Card title="Resumen de Proyectos" styles={{
                                    body: { 
                                    padding: 8,
                                    margin: 4,
                                    height: 300,
                                    overflowY: 'scroll'
                                    },
                                    header: {
                                    borderBottom: '1px solid #f0f0f0' // opcional, para mantener línea bajo el título
                                    }
                                }}>
                            {loadingProyectos ? (
                                <Spin />
                            ) : (
                                <List
                                    dataSource={proyectos}
                                    renderItem={(item) => (
                                        <List.Item key={item.id}>
                                        <List.Item.Meta
                                            title={
                                                <span style={{ color: '#1890ff' }}>
                                                    Proyecto {item.proyecto}
                                                </span>
                                            }
                                            description={item.nombre_proyecto || 'Sin descripción'}
                                        />
                                        </List.Item>
                                    )}
                                />
                            )}
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Fuentes Cuipo" styles={{
                                    body: { 
                                    padding: 8,
                                    margin: 4,
                                    height: 300,
                                    overflowY: 'scroll'
                                    },
                                    header: {
                                    borderBottom: '1px solid #f0f0f0' // opcional, para mantener línea bajo el título
                                    }
                                }}>
                            {loadingFuentesCuipo ? (
                                <Spin />
                            ) : (
                                <List
                                    dataSource={fuentesCuipo}
                                    renderItem={(item) => (
                                        <List.Item key={item.id}>
                                        <List.Item.Meta
                                            title={
                                                <span style={{ color: '#1890ff' }}>
                                                {item.tipo_de_recurso}
                                                </span>
                                            }
                                            description={
                                            <>
                                                <div><strong>Código:</strong> {item.cod}</div>
                                                <div><strong>Situación de Fondos:</strong> {item.situacion_de_fondos}</div>
                                                <div>{item.descripcion_cuipo || 'Sin descripción'}</div>
                                            </>
                                            }
                                        />
                                        </List.Item>
                                    )}
                                />
                            )}
                        </Card>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Card title="Dependencias" styles={{
                                    body: { 
                                    padding: 8,
                                    margin: 4,
                                    height: 300,
                                    overflowY: 'scroll'
                                    },
                                    header: {
                                    borderBottom: '1px solid #f0f0f0' // opcional, para mantener línea bajo el título
                                    }
                                }}>
                            {loadingDependencias ? (
                                <Spin />
                            ) : (
                                <List
                                    dataSource={dependencias}
                                    renderItem={(item) => (
                                        <List.Item key={item.id}>
                                        <List.Item.Meta
                                            title={
                                                <span style={{ color: '#1890ff' }}>
                                                Dependencia {item.dependencia}
                                                </span>
                                            }
                                            description={
                                            <>
                                                <div><strong>Seccion Presupuestal:</strong> {item.seccion_presupuestal}</div>
                                            </>
                                            }
                                        />
                                        </List.Item>
                                    )}
                                />
                            )}
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Catálogo de Productos" styles={{
                                    body: { 
                                    padding: 8,
                                    margin: 4,
                                    height: 300,
                                    overflowY: 'scroll',
                                    },
                                    header: {
                                    borderBottom: '1px solid #f0f0f0' // opcional, para mantener línea bajo el título
                                    }
                                }}>
                            {loadingCatalogoProductos ? (
                                <Spin />
                            ) : (
                                <List
                                    dataSource={catalogoProductos}
                                    renderItem={(item) => (
                                        <List.Item key={item.id}>
                                        <List.Item.Meta
                                            title={
                                                <span style={{ color: '#1890ff' }}>
                                                Cod Indicador de Producto: {item.codigo_del_indicador_de_producto}
                                                </span>
                                            }
                                            description={
                                            <>
                                                <div><strong>Indicador de Producto:</strong> {item.indicador_de_producto}</div>
                                            </>
                                            }
                                        />
                                        </List.Item>
                                    )}
                                />
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Home;
