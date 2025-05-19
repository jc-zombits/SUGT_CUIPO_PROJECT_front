import React, { useState } from 'react';
import { Input, Button, Select, Form, notification, Card, Row, Col, Space, Typography, Table } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const FormPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [cpcOptions, setCpcOptions] = useState([]);
    const [selectedCpc, setSelectedCpc] = useState(null);
    const [cpcData, setCpcData] = useState(null);
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

    // Función para buscar opciones de CPC
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

    // FUNCIÓN CORREGIDA - Manejar selección de CPC
    const handleCpcSelect = (value) => {
        const codigoNumerico = value.split(' - ')[0];
        
        form.setFieldsValue({
            estado_validacion: 'CPC OK',
            cpc_cuipo: codigoNumerico
        });
        
        setSelectedCpc(value);
        
        // Si necesitas cargar detalles adicionales
        if (codigoNumerico) {
            loadCpcDetails(codigoNumerico);
        }
    };

    // Función para cargar detalles (si es necesaria)
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
                                <Title level={3} style={{ textAlign: 'center', marginBottom: 0 }}>
                                    Gestión Plantilla Distrito 2025
                                </Title>
                            </Space>
                        }
                        bordered={false}
                        headStyle={{ borderBottom: 0 }}
                    >
                        {/* FORMULARIO CORREGIDO */}
                        <Form 
                            form={form} 
                            layout="vertical"
                            initialValues={{
                                estado_validacion: 'FAVOR DILIGENCIAR CPC',
                                cpc_cuipo: 'N/A'
                            }}
                        >
                            {/* Select de búsqueda (se mantiene igual) */}
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

                            {/* Campo Estado de Validación - CORREGIDO */}
                            <Form.Item 
                                label={<Text strong>Estado de Validación</Text>}
                                name="estado_validacion"
                            >
                                <Select disabled size="large">
                                    <Select.Option value="FAVOR DILIGENCIAR CPC">FAVOR DILIGENCIAR CPC</Select.Option>
                                    <Select.Option value="CPC OK">CPC OK</Select.Option>
                                </Select>
                            </Form.Item>

                            {/* Campo CPC CUIPO - CORREGIDO */}
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
    );
};

export default FormPage;