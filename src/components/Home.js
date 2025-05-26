import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, List, Spin, Alert } from 'antd';
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
    const [error, setError] = useState(null);
    const [cpc, setCpc] = useState([]);
    const [loadingCpc, setLoadingCpc] = useState(true);

    // Función genérica para fetch
    const fetchData = async (url, setData, setLoading) => {
        try {
            setLoading(true);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data = await response.json();
            setData(data);
            setError(null);
        } catch (err) {
            console.error(`Error fetching ${url}:`, err);
            setError(err.message);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(
            'http://localhost:5001/api/v1/cuipo/proyectos',
            setProyectos,
            setLoadingProyectos
        );
    }, []);

    useEffect(() => {
        fetchData(
            'http://localhost:5001/api/v1/cuipo/fuentes-cuipo',
            setFuentesCuipo,
            setLoadingFuentesCuipo
        );
    }, []);

    useEffect(() => {
        fetchData(
            'http://localhost:5001/api/v1/cuipo/dependencias',
            setDependencias,
            setLoadingDependencias
        );
    }, []);

    useEffect(() => {
        fetchData(
            'http://localhost:5001/api/v1/cuipo/catalogo-productos',
            setCatalogoProductos,
            setLoadingCatalogoProductos
        );
    }, []);

    useEffect(() => {
        fetchData(
            'http://localhost:5001/api/v1/cuipo/cpc-data',
            setCpc,
            setLoadingCpc
        );
    }, []);

    return (
        <>
            <Navbar />
            <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
                <Title level={2} style={{ color: '#1890ff' }}>Bienvenido a Cuipo Project</Title>
                <Paragraph>Resumen del detalle de los datos</Paragraph>

                {error && (
                    <Alert
                        message="Error al cargar datos"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={12}>
                        <Card 
                            title="Resumen de Proyectos" 
                            styles={{
                                body: { 
                                    padding: 8,
                                    margin: 4,
                                    height: 300,
                                    overflowY: 'scroll'
                                },
                                header: {
                                    borderBottom: '1px solid #f0f0f0'
                                }
                            }}
                        >
                            {loadingProyectos ? (
                                <Spin />
                            ) : (
                                <List
                                    dataSource={proyectos}
                                    renderItem={(item) => (
                                        <List.Item key={item.id || item._id || item.proyecto}>
                                            <List.Item.Meta
                                                title={
                                                    <span style={{ color: '#1890ff' }}>
                                                        Proyecto {item.proyecto || 'N/A'}
                                                    </span>
                                                }
                                                description={item.nombre_proyecto || 'Sin descripción'}
                                            />
                                        </List.Item>
                                    )}
                                    locale={{ emptyText: 'No hay proyectos disponibles' }}
                                />
                            )}
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card 
                            title="Fuentes Cuipo" 
                            styles={{
                                body: { 
                                    padding: 8,
                                    margin: 4,
                                    height: 300,
                                    overflowY: 'scroll'
                                },
                                header: {
                                    borderBottom: '1px solid #f0f0f0'
                                }
                            }}
                        >
                            {loadingFuentesCuipo ? (
                                <Spin />
                            ) : (
                                <List
                                    dataSource={fuentesCuipo}
                                    renderItem={(item) => (
                                        <List.Item key={item.id || item._id || item.cod}>
                                            <List.Item.Meta
                                                title={
                                                    <span style={{ color: '#1890ff' }}>
                                                        {item.tipo_de_recurso || 'Tipo no especificado'}
                                                    </span>
                                                }
                                                description={
                                                    <>
                                                        <div><strong>Código:</strong> {item.cod || 'N/A'}</div>
                                                        <div><strong>Situación de Fondos:</strong> {item.situacion_de_fondos || 'N/A'}</div>
                                                        <div>{item.descripcion_cuipo || 'Sin descripción'}</div>
                                                    </>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                    locale={{ emptyText: 'No hay fuentes disponibles' }}
                                />
                            )}
                        </Card>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Card 
                            title="Dependencias" 
                            styles={{
                                body: { 
                                    padding: 8,
                                    margin: 4,
                                    height: 300,
                                    overflowY: 'scroll'
                                },
                                header: {
                                    borderBottom: '1px solid #f0f0f0'
                                }
                            }}
                        >
                            {loadingDependencias ? (
                                <Spin />
                            ) : (
                                <List
                                    dataSource={dependencias}
                                    renderItem={(item) => (
                                        <List.Item key={item.id || item._id || item.dependencia}>
                                            <List.Item.Meta
                                                title={
                                                    <span style={{ color: '#1890ff' }}>
                                                        Dependencia {item.dependencia || 'N/A'}
                                                    </span>
                                                }
                                                description={
                                                    <>
                                                        <div><strong>Seccion Presupuestal:</strong> {item.seccion_presupuestal || 'N/A'}</div>
                                                    </>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                    locale={{ emptyText: 'No hay dependencias disponibles' }}
                                />
                            )}
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card 
                            title="Catálogo de Productos" 
                            styles={{
                                body: { 
                                    padding: 8,
                                    margin: 4,
                                    height: 300,
                                    overflowY: 'scroll'
                                },
                                header: {
                                    borderBottom: '1px solid #f0f0f0'
                                }
                            }}
                        >
                            {loadingCatalogoProductos ? (
                                <Spin />
                            ) : (
                                <List
                                    dataSource={catalogoProductos}
                                    renderItem={(item) => (
                                        <List.Item key={item.id || item._id || item.codigo_del_indicador_de_producto}>
                                            <List.Item.Meta
                                                title={
                                                    <span style={{ color: '#1890ff' }}>
                                                        Cod Indicador de Producto: {item.codigo_del_indicador_de_producto || 'N/A'}
                                                    </span>
                                                }
                                                description={
                                                    <>
                                                        <div><strong>Indicador de Producto:</strong> {item.indicador_de_producto || 'N/A'}</div>
                                                    </>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                    locale={{ emptyText: 'No hay productos disponibles' }}
                                />
                            )}
                        </Card>
                    </Col>
                </Row>

                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={12}>
                        <Card 
                            title="C P C" 
                            styles={{
                                body: { 
                                    padding: 8,
                                    margin: 4,
                                    height: 300,
                                    overflowY: 'scroll'
                                },
                                header: {
                                    borderBottom: '1px solid #f0f0f0'
                                }
                            }}
                        >
                            {loadingCpc ? (
                                <Spin />
                            ) : (
                                <List
                                    dataSource={cpc}
                                    renderItem={(item) => (
                                        <List.Item key={item.id || item._id || item.codigo}>
                                            <List.Item.Meta
                                                title={
                                                    <span style={{ color: '#1890ff' }}>
                                                        Cod Indicador del producto CPC: {item.codigo_clase_o_subclase || 'N/A'}
                                                    </span>
                                                }
                                                description={
                                                    <>
                                                        <div><strong>Identificador de CPC:</strong> {item.cpc_codigo || 'N/A'}</div>
                                                        <div><strong>Clase o Subclase:</strong> {item.clase_o_subclase || 'N/A'}</div>
                                                    </>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                    locale={{ emptyText: 'No hay CPCs disponibles' }}
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