"use client"

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
    const [productosMGAOptions, setProductosMGAOptions] = useState([]);
    const [secretariasOptions, setSecretariasOptions] = useState([]);
    const [ejecucionData, setEjecucionData] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

    // Columnas para la tabla de ejecución presupuestal
    const ejecucionColumns = [
        {
            title: 'Etiquetas de Fila',
            dataIndex: ['programacion', 'etiquetas_de_fila'],
            key: 'etiquetas_de_fila',
            render: (text) => text || '-'
        },
        {
            title: 'Vigencia Gasto',
            dataIndex: ['programacion', 'vigencia_gasto'],
            key: 'vigencia_gasto',
            render: (text) => text || '-'
        },
        {
            title: 'Sección Presupuestal CUIPO',
            dataIndex: ['programacion', 'seccion_ptal_cuipo'],
            key: 'seccion_ptal_cuipo',
            render: (text) => text || '-'
        },
        {
            title: 'Sector CUIPO',
            dataIndex: ['programacion', 'sector_cuipo'],
            key: 'sector_cuipo',
            render: (text) => text || '-'
        },
        {
            title: 'Detalle Sectorial Prog. Gasto',
            dataIndex: ['programacion', 'detalle_sectorial_prog_gasto'],
            key: 'detalle_sectorial_prog_gasto',
            render: (text) => text || '-'
        },
        {
            title: 'Presupuesto Inicial',
            dataIndex: ['programacion', 'suma_de_ppto_inicial'],
            key: 'suma_de_ppto_inicial',
            render: (value) => value ? `$${value.toLocaleString()}` : '$0'
        },
        {
            title: 'Total Presupuesto Actual',
            dataIndex: ['programacion', 'suma_de_total_ppto_actual'],
            key: 'suma_de_total_ppto_actual',
            render: (value) => value ? `$${value.toLocaleString()}` : '$0'
        },
        {
            title: 'POSPRE CUIPO',
            dataIndex: ['ejecucion', 'pospre_cuipo'],
            key: 'pospre_cuipo',
            render: (text) => text || '-'
        },
        {
            title: 'Producto CUIPO',
            dataIndex: ['ejecucion', 'producto_cuipo'],
            key: 'producto_cuipo',
            render: (text) => text || '-'
        },
        {
            title: 'CPC CUIPO',
            dataIndex: ['ejecucion', 'cpc_cuipo'],
            key: 'cpc_cuipo',
            render: (text) => text || '-'
        },
        {
            title: 'Fuente CUIPO',
            dataIndex: ['ejecucion', 'fuente_cuipo'],
            key: 'fuente_cuipo',
            render: (text) => text || '-'
        },
        {
            title: 'Situación de Fondos',
            dataIndex: ['ejecucion', 'situacion_de_fondos'],
            key: 'situacion_de_fondos',
            render: (text) => text || '-'
        },
        {
            title: 'Ejecución',
            dataIndex: ['ejecucion', 'suma_de_ejecucion'],
            key: 'suma_de_ejecucion',
            render: (value) => value ? `$${value.toLocaleString()}` : '$0'
        },
        {
            title: 'Factura',
            dataIndex: ['ejecucion', 'suma_de_factura'],
            key: 'suma_de_factura',
            render: (value) => value ? `$${value.toLocaleString()}` : '$0'
        },
        {
            title: 'Pagos',
            dataIndex: ['ejecucion', 'suma_de_pagos'],
            key: 'suma_de_pagos',
            render: (value) => value ? `$${value.toLocaleString()}` : '$0'
        }
    ];

    // Cargar opciones al montar el componente
    useEffect(() => {
        const loadInitialOptions = async () => {
            try {
                setLoading(true);
                
                // Cargar productos MGA
                const productosResponse = await axios.get('http://localhost:5001/api/v1/cuipo/productos-mga');
                if (productosResponse.data?.success) {
                    setProductosMGAOptions(productosResponse.data.data);
                }

                // Cargar secretarías
                const secretariasResponse = await axios.get('http://localhost:5001/api/v1/cuipo/secretarias', {
                    params: { query: '' }
                });
                
                if (secretariasResponse.data?.success) {
                    setSecretariasOptions(secretariasResponse.data.data);
                } else {
                    console.warn('La respuesta de secretarías no tuvo éxito:', secretariasResponse.data);
                    setSecretariasOptions([]);
                }
            } catch (error) {
                console.error('Error al cargar opciones:', error);
                notification.error({
                    message: 'Error',
                    description: 'No se pudieron cargar las opciones iniciales',
                    placement: 'topRight'
                });
            } finally {
                setLoading(false);
            }
        };
        
        loadInitialOptions();
    }, []);

    // Función para buscar opciones de CPC
    const fetchCpcOptions = async (query) => {
        if (!query || query.length < 2) {
            setCpcOptions([]);
            return;
        }
        
        setSearchLoading(true);
        try {
            const response = await axios.get('http://localhost:5001/api/v1/cuipo/cpc-opciones', {
                params: { query },
                timeout: 5000 // 5 segundos de timeout
            });
            
            // Verificación profunda de la respuesta
            if (response.data?.success && Array.isArray(response.data.data)) {
                setCpcOptions(response.data.data);
            } else {
                throw new Error('Formato de respuesta inválido');
            }
        } catch (error) {
            console.error('Detalles del error al cargar CPC:', {
                message: error.message,
                config: error.config,
                response: error.response?.data
            });
            
            notification.error({
                message: 'Error',
                description: error.response?.data?.error || 'Error al buscar CPC',
                placement: 'topRight'
            });
            setCpcOptions([]);
        } finally {
            setSearchLoading(false);
        }
    };

    // Manejar selección de CPC
    const handleCpcSelect = (value) => {
        if (value) {
            const codigoCPC = value.split(' - ')[0];
            const ultimoDigitoCPC = codigoCPC.slice(-1);
            
            form.setFieldsValue({
                validador_cpc: 'CPC OK',
                tiene_cpc: ultimoDigitoCPC
            });
        } else {
            form.setFieldsValue({
                codigo_y_nombre_cpc: 'Favor llenar campo',
                validador_cpc: 'N/A',
                tiene_cpc: ''
            });
        }
    };

    // Manejar selección de producto MGA
    const handleProductoMGASelect = (value) => {
        if (value) {
            const codigoProducto = value.split(' - ')[0];
            const primeros7Digitos = codigoProducto.substring(0, 7);
            
            form.setFieldsValue({
                validador_producto: 'PRODUCTO OK',
                producto_ppal: primeros7Digitos
            });
        } else {
            form.setFieldsValue({
                codigo_y_nombre_producto_mga: 'Favor seleccionar una opción',
                validador_producto: 'N/A',
                producto_ppal: ''
            });
        }
    };

    // Validar datos y obtener resultados
    const handleValidarDatos = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            
            const response = await axios.post('http://localhost:5001/api/v1/cuipo/validar-datos', {
                cpc: values.codigo_y_nombre_cpc,
                producto: values.codigo_y_nombre_producto_mga,
                secretaria: values.secretaria
            });
            
            console.log('Respuesta de validación:', response.data);

            if (response.data.success && Array.isArray(response.data.data)) {
                // Transformar los datos para que coincidan con la estructura de las columnas
                const transformedData = response.data.data.map(item => ({
                    programacion: {
                        etiquetas_de_fila: item.etiquetas_de_fila || '-',
                        vigencia_gasto: item.vigencia_gasto || '-',
                        seccion_ptal_cuipo: item.seccion_ptal_cuipo || '-',
                        sector_cuipo: item.sector_cuipo || '-',
                        detalle_sectorial_prog_gasto: item.detalle_sectorial_prog_gasto || '-',
                        suma_de_ppto_inicial: item.suma_de_ppto_inicial || 0,
                        suma_de_total_ppto_actual: item.suma_de_total_ppto_actual || 0
                    },
                    ejecucion: {
                        pospre_cuipo: item.pospre_cuipo || '-',
                        producto_cuipo: item.producto_cuipo || '-',
                        cpc_cuipo: item.cpc_cuipo || '-',
                        fuente_cuipo: item.fuente_cuipo || '-',
                        situacion_de_fondos: item.situacion_de_fondos || '-',
                        suma_de_ejecucion: item.suma_de_ejecucion || 0,
                        suma_de_factura: item.suma_de_factura || 0,
                        suma_de_pagos: item.suma_de_pagos || 0
                    }
                }));

                setEjecucionData(transformedData);
                setShowResults(true);
                
                notification.success({
                    message: 'Éxito',
                    description: 'Datos validados correctamente',
                    placement: 'topRight'
                });
            } else {
                notification.warning({
                    message: 'Advertencia',
                    description: response.data.message || 'No se encontraron resultados válidos',
                    placement: 'topRight'
                });
            }
        } catch (error) {
            console.error('Error al validar datos:', error);
            notification.error({
                message: 'Error',
                description: 'Ocurrió un error al validar los datos',
                placement: 'topRight'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate('/cuipo');
    };

     return (
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
                                codigo_y_nombre_cpc: 'Favor llenar campo',
                                validador_cpc: 'N/A',
                                codigo_y_nombre_producto_mga: 'Favor seleccionar una opción',
                                validador_producto: 'N/A'
                            }}
                        >
                            {/* Sección Secretaría */}
                            <Form.Item
                                label={<Text strong>Secretaría</Text>}
                                name="secretaria"
                                rules={[{ required: true, message: 'Por favor seleccione una secretaría' }]}
                            >
                                <Select
                                    placeholder="Seleccione una secretaría"
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {secretariasOptions.map((secretaria, index) => (
                                        <Select.Option key={index} value={secretaria}>
                                            {secretaria}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Sección CPC */}
                            <Form.Item
                                label={<Text strong>Código y Nombre del CPC</Text>}
                                name="codigo_y_nombre_cpc"
                            >
                                <Select
                                    showSearch
                                    placeholder="Busque por código o nombre del CPC"
                                    onSearch={fetchCpcOptions}
                                    onChange={handleCpcSelect}
                                    filterOption={false}
                                    loading={searchLoading}
                                    size="large"
                                    allowClear
                                >
                                    {cpcOptions.map((item, index) => (
                                        <Select.Option key={index} value={item}>
                                            {item}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={<Text strong>Tiene CPC</Text>}
                                name="tiene_cpc"
                            >
                                <Input size="large" disabled />
                            </Form.Item>

                            <Form.Item
                                label={<Text strong>Validador CPC</Text>}
                                name="validador_cpc"
                            >
                                <Input size="large" disabled />
                            </Form.Item>

                            {/* Sección Producto MGA */}
                            <Form.Item
                                label={<Text strong>Código y nombre del producto MGA</Text>}
                                name="codigo_y_nombre_producto_mga"
                            >
                                <Select
                                    placeholder="Seleccione un producto MGA"
                                    onChange={handleProductoMGASelect}
                                    size="large"
                                    allowClear
                                >
                                    {productosMGAOptions.map((producto, index) => (
                                        <Select.Option key={index} value={producto}>
                                            {producto}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={<Text strong>Producto Principal</Text>}
                                name="producto_ppal"
                            >
                                <Input size="large" disabled />
                            </Form.Item>

                            <Form.Item
                                label={<Text strong>Validador Producto</Text>}
                                name="validador_producto"
                            >
                                <Input size="large" disabled />
                            </Form.Item>

                            {/* Botones de acción */}
                            <Form.Item>
                                <Space size="large" style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <Button 
                                        type="default" 
                                        onClick={handleGoBack}
                                        size="large"
                                    >
                                        Volver
                                    </Button>
                                    <Button 
                                        type="primary" 
                                        size="large"
                                        onClick={handleValidarDatos}
                                        loading={loading}
                                    >
                                        Validar Datos
                                    </Button>
                                </Space>
                            </Form.Item>

                            {/* Resultados - Tabla de Ejecución Presupuestal */}
                            {showResults && (
                                <Form.Item label={<Text strong>Ejecución Presupuestal</Text>}>
                                    <Table 
                                        columns={ejecucionColumns}
                                            dataSource={ejecucionData}
                                            size="small"
                                            bordered
                                            scroll={{ x: 1500 }}  // Ajusta según necesidad
                                            rowKey={(record) => `${record.ejecucion.pospre_cuipo}-${record.ejecucion.producto_cuipo}-${record.programacion.vigencia_gasto}`}
                                            loading={loading}
                                    />
                                </Form.Item>
                            )}
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default FormPage;