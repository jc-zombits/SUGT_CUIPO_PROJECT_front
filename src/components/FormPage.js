import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Form, notification, Card, Row, Col, Space, Typography, Table } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const { Title, Text } = Typography;

const FormPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [cpcOptions, setCpcOptions] = useState([]);
    const [selectedCpc, setSelectedCpc] = useState(null);
    const [cpcData, setCpcData] = useState(null);
    const [productosMGA, setProductosMGA] = useState([]);
    const [loadingProductos, setLoadingProductos] = useState(false);
    const navigate = useNavigate();

    // Columnas para la tabla de datos CPC
    const columns = [
        {
            title: 'Campo',
            dataIndex: 'field',
            key: 'field',
            width: '30%'
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
        },
    ];

    // Cargar productos MGA al montar el componente
    useEffect(() => {
        const fetchProductosMGA = async () => {
            setLoadingProductos(true);
            try {
                const response = await axios.get('http://localhost:5001/api/v1/cuipo/productos-mga');
                if (response.data.success) {
                    setProductosMGA(response.data.data);
                }
            } catch (error) {
                console.error('Error al cargar productos MGA:', error);
                notification.error({
                    message: 'Error',
                    description: 'No se pudieron cargar los productos MGA',
                    placement: 'topRight'
                });
            } finally {
                setLoadingProductos(false);
            }
        };
        
        fetchProductosMGA();
    }, []);

    // Función para buscar opciones de CPC (existente - se mantiene igual)
    const fetchCpcOptions = async (query) => {
        if (!query || query.length < 2) {
            setCpcOptions([]);
            return;
        }
        
        setSearchLoading(true);
        try {
            const response = await axios.get('http://localhost:5001/api/v1/cuipo/cpc-opciones', {
                params: { query }
            });
            
            const optionsData = Array.isArray(response.data) ? response.data : 
                              (response.data?.data || []);
            
            setCpcOptions(optionsData);
        } catch (error) {
            console.error('Error al cargar opciones de CPC:', error);
            notification.error({
                message: 'Error',
                description: 'No se pudieron cargar las opciones de CPC',
                placement: 'topRight'
            });
            setCpcOptions([]);
        } finally {
            setSearchLoading(false);
        }
    };

    // Manejar selección de CPC (existente - se mantiene igual)
    const handleCpcSelect = (value) => {
        const codigoNumerico = value.split(' - ')[0];
        
        form.setFieldsValue({
            estado_validacion: 'CPC OK',
            cpc_cuipo: codigoNumerico
        });
        
        setSelectedCpc(value);
        
        if (codigoNumerico) {
            loadCpcDetails(codigoNumerico);
        }
    };

    // Manejar selección de producto MGA
    const handleProductoMGASelect = (value) => {
        if (value) {
            // Encontrar el producto seleccionado
            const productoSeleccionado = productosMGA.find(p => p.valorCompleto === value);
            
            if (productoSeleccionado) {
                // Extraer los primeros 7 dígitos para el campo CUIPO
                const codigoCUIPO = productoSeleccionado.codigo;
                form.setFieldsValue({
                    producto_cuipo: codigoCUIPO
                });
            }
        } else {
            form.setFieldsValue({
                producto_cuipo: ''
            });
        }
    };

    // Función para cargar detalles (existente - se mantiene igual)
    const loadCpcDetails = async (codigo) => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5001/api/v1/cuipo/cpc-detalles', {
                params: { codigo }
            });
            setCpcData(response.data);
        } catch (error) {
            console.error('Error al cargar detalles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate('/cuipo');
    };

    const tableData = cpcData
    ? Object.entries(cpcData).map(([key, value]) => ({
        key,
        field: key,
        value: String(value),
    }))
    : [];

    return (
        <>
            <Navbar />
            <div style={{ padding: '24px' }}>
                <Row justify="center">
                    <Col xs={24} sm={22} md={20} lg={18} xl={16}>
                        <Card 
                            title={
                                <Space>
                                    <Button 
                                        type="text" 
                                        icon={<ArrowLeftOutlined />} 
                                        onClick={handleGoBack}
                                        style={{ marginRight: 8 }}
                                    />
                                    <Title level={3} style={{ textAlign: 'center', marginBottom: 0, color: '#050C9C', fontWeight: 'bold' }}>
                                        Gestión Plantilla Distrito 2025
                                    </Title>
                                </Space>
                            }
                            bordered={false}
                            headStyle={{ borderBottom: 0 }}
                        >
                            <Form 
                                form={form} 
                                layout="vertical"
                                initialValues={{
                                    estado_validacion: 'FAVOR DILIGENCIAR CPC',
                                    cpc_cuipo: 'N/A',
                                    producto_cuipo: ''
                                }}
                            >
                                {/* Select de búsqueda CPC (existente) */}
                                <Form.Item
                                    label={<Text strong>Código y Nombre del CPC</Text>}
                                    name="codigo_cpc"
                                >
                                    <Select
                                        showSearch
                                        placeholder="Busque por código o nombre del CPC"
                                        onSearch={fetchCpcOptions}
                                        onChange={handleCpcSelect}
                                        filterOption={false}
                                        loading={searchLoading}
                                        size="large"
                                    >
                                        {cpcOptions.map((item, index) => (
                                            <Select.Option key={index} value={item}>
                                                {item}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                {/* Nuevos campos para productos MGA */}
                                <Form.Item
                                    label={<Text strong>Código y nombre del producto MGA</Text>}
                                    name="producto_mga"
                                >
                                    <Select
                                        placeholder="Seleccione un producto MGA"
                                        onChange={handleProductoMGASelect}
                                        loading={loadingProductos}
                                        size="large"
                                        allowClear
                                    >
                                        {productosMGA.map((producto, index) => (
                                            <Select.Option key={index} value={producto.valorCompleto}>
                                                {producto.valorCompleto}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label={<Text strong>Producto CUIPO</Text>}
                                    name="producto_cuipo"
                                >
                                    <Input size="large" disabled />
                                </Form.Item>

                                {/* Campo Estado de Validación (existente) */}
                                <Form.Item 
                                    label={<Text strong>Estado de Validación</Text>}
                                    name="estado_validacion"
                                >
                                    <Select disabled size="large">
                                        <Select.Option value="FAVOR DILIGENCIAR CPC">FAVOR DILIGENCIAR CPC</Select.Option>
                                        <Select.Option value="CPC OK">CPC OK</Select.Option>
                                    </Select>
                                </Form.Item>

                                {/* Campo CPC CUIPO (existente) */}
                                <Form.Item
                                    label={<Text strong>CPC CUIPO</Text>}
                                    name="cpc_cuipo"
                                >
                                    <Input size="large" disabled />
                                </Form.Item>

                                {cpcData && (
                                    <Form.Item label={<Text strong>Datos del CPC</Text>}>
                                        <Table 
                                            columns={columns}
                                            dataSource={tableData}
                                            size="small"
                                            bordered
                                            pagination={false}
                                        />
                                    </Form.Item>
                                )}

                                <Form.Item>
                                    <Space direction="vertical" style={{ width: '100%', paddingTop: '18px' }}>
                                        <Button 
                                            style={{ backgroundColor: '#0044D0', color: "#fff", hover: { textColor: '#0000DF' } }}
                                            type="default" 
                                            onClick={handleGoBack}
                                            size="large"
                                            block
                                        >
                                            Volver al Inicio
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default FormPage;