import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Button, Space, Spin, notification } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const { Title, Text } = Typography;

const Ejecucion = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const navigate = useNavigate();

    // Columnas para la tabla
    const columns = [
        {
            title: 'ID Ejecución',
            dataIndex: 'id_ejecucion',
            key: 'id_ejecucion',
            width: 100,
            sorter: (a, b) => a.id_ejecucion - b.id_ejecucion,
        },
        {
            title: 'ID Plantilla',
            dataIndex: 'id_plantilla',
            key: 'id_plantilla',
            width: 100,
            sorter: (a, b) => a.id_plantilla - b.id_plantilla,
        },
        {
            title: 'POSPRE CUIPO',
            dataIndex: 'pospre_cuipo',
            key: 'pospre_cuipo',
            sorter: (a, b) => a.pospre_cuipo.localeCompare(b.pospre_cuipo),
        },
        {
            title: 'Sección Principal',
            dataIndex: 'seccion_ptal_cuipo',
            key: 'seccion_ptal_cuipo',
        },
        {
            title: 'CPC CUIPO',
            dataIndex: 'cpc_cuipo',
            key: 'cpc_cuipo',
        },
        {
            title: 'Situación Fondos',
            dataIndex: 'situacion_de_fondos',
            key: 'situacion_de_fondos',
        },
        {
            title: 'Suma Ejecución',
            dataIndex: 'suma_de_ejecucion',
            key: 'suma_de_ejecucion',
            render: (value) => value ? `$${value.toLocaleString()}` : '-',
        },
        {
            title: 'Fondo',
            dataIndex: 'fondo',
            key: 'fondo',
        },
        {
            title: 'POSPRE',
            dataIndex: 'pospre',
            key: 'pospre',
        },
        {
            title: 'Proyecto',
            dataIndex: 'proyecto',
            key: 'proyecto',
        },
        {
            title: 'Nombre Proyecto',
            dataIndex: 'nombre_proyecto',
            key: 'nombre_proyecto',
            width: 250,
        },
    ];

    // Función para obtener datos con paginación
    const fetchData = async (page = 1, pageSize = pagination.pageSize) => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5001/api/v1/cuipo/ejecucion-presu', {
                params: {
                    page,
                    limit: pageSize
                }
            });

            if (response.data.success) {
                setData(response.data.data);
                setPagination({
                    ...pagination,
                    current: page,
                    pageSize,
                    total: response.data.pagination.total,
                });
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
            notification.error({
                message: 'Error',
                description: 'No se pudieron cargar los datos de ejecución',
                placement: 'topRight'
            });
        } finally {
            setLoading(false);
        }
    };

    // Obtener datos al montar el componente
    useEffect(() => {
        fetchData();
    }, []);

    // Manejar cambio de paginación
    const handleTableChange = (pagination, filters, sorter) => {
        fetchData(pagination.current, pagination.pageSize);
    };

    const handleGoBack = () => {
        navigate('/cuipo');
    };

    return (
        <>
            <Navbar />
            <div style={{ padding: '24px' }}>
                <Card
                    title={
                        <Space>
                            <Button 
                                type="text" 
                                icon={<ArrowLeftOutlined />} 
                                onClick={handleGoBack}
                                style={{ marginRight: 8 }}
                            />
                            <Title level={3}>Comparación de Ejecución</Title>
                        </Space>
                    }
                    bordered={false}
                    extra={
                        <Button 
                            type="primary" 
                            icon={<ArrowLeftOutlined />}
                            onClick={handleGoBack}
                        >
                            Volver al Inicio
                        </Button>
                    }
                >
                    <Spin spinning={loading}>
                        <Table
                            columns={columns}
                            dataSource={data}
                            rowKey="id_ejecucion"
                            scroll={{ x: 'max-content' }}
                            pagination={{
                                ...pagination,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '50', '100'],
                                showTotal: (total) => `Total ${total} registros`,
                            }}
                            onChange={handleTableChange}
                            bordered
                        />
                    </Spin>
                </Card>
            </div>
        </>
    );
};

export default Ejecucion;