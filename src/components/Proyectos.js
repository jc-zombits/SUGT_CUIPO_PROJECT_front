import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Input, Space, Button, notification } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Search } = Input;

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  // Columnas para la tabla
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Código Proyecto',
      dataIndex: 'proyecto',
      key: 'proyecto',
      sorter: (a, b) => a.proyecto.localeCompare(b.proyecto),
    },
    {
      title: 'Prioridad',
      dataIndex: 'p',
      key: 'p',
      width: 100,
      sorter: (a, b) => a.p.localeCompare(b.p),
    },
    {
      title: 'Distrito',
      dataIndex: 'distrito_m1',
      key: 'distrito_m1',
      sorter: (a, b) => a.distrito_m1.localeCompare(b.distrito_m1),
    },
    {
      title: 'Nombre del Proyecto',
      dataIndex: 'nombre_proyecto',
      key: 'nombre_proyecto',
      sorter: (a, b) => a.nombre_proyecto.localeCompare(b.nombre_proyecto),
    },
  ];

  // Obtener proyectos al montar el componente
  useEffect(() => {
    const fetchProyectos = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5001/api/v1/cuipo/proyectos-page');
        if (response.data.success) {
          setProyectos(response.data.data);
          setFilteredData(response.data.data);
        }
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
        notification.error({
          message: 'Error',
          description: 'No se pudieron cargar los proyectos',
          placement: 'topRight'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProyectos();
  }, []);

  // Función para buscar proyectos
  const handleSearch = (value) => {
    setSearchText(value);
    if (value === '') {
      setFilteredData(proyectos);
    } else {
      const filtered = proyectos.filter(proyecto =>
        Object.values(proyecto).some(
          val => val && val.toString().toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  };

  const handleGoBack = () => {
    navigate('/cuipo');
  };

  return (
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
            <Space direction="vertical" style={{ width: '100%' }}>
              <Title level={3}>Listado de Proyectos</Title>
              <Text type="secondary">Gestión y visualización de todos los proyectos disponibles</Text>
            </Space>
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
        <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
          <Search
            placeholder="Buscar proyectos..."
            allowClear
            enterButton="Buscar"
            size="large"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            value={searchText}
            style={{ maxWidth: 500 }}
          />
          <Text strong>{filteredData.length} proyectos encontrados</Text>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `Total ${total} proyectos`,
          }}
          scroll={{ x: 'max-content' }}
          bordered
        />
      </Card>
    </div>
  );
};

export default Proyectos;