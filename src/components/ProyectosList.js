import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Typography, Tabs } from 'antd';

const { Text, Title } = Typography;
const { TabPane } = Tabs;

const ProyectosList = ({ filtros }) => {
  const [datos, setDatos] = useState({
    plantilla: [],
    financieros: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filtros?.secretaria) params.append('secretaria', filtros.secretaria);
      if (filtros?.sector) params.append('sector', filtros.sector);
      if (filtros?.nombreProyecto) params.append('nombreProyecto', filtros.nombreProyecto);

      const response = await fetch(
        `http://localhost:5001/api/v1/cuipo/proyectos-list?${params.toString()}`
      );
      
      if (!response.ok) throw new Error('Error al obtener datos');
      
      const result = await response.json();
      
      setDatos({
        plantilla: result.datosPlantilla || [],
        financieros: result.datosFinancieros || []
      });
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (filtros?.secretaria) {
    fetchData();
  } else {
    setDatos({ plantilla: [], financieros: [] });
  }
}, [filtros]);

  // Columnas para datos de plantilla
  const columnsPlantilla = [
    {
      title: 'Nombre del Proyecto',
      dataIndex: 'nombre_proyecto',
      key: 'nombre_proyecto',
      render: (text) => <Text strong>{text}</Text>,
      sorter: (a, b) => a.nombre_proyecto.localeCompare(b.nombre_proyecto),
    },
    {
      title: 'ID Proyecto',
      dataIndex: 'proyecto',
      key: 'proyecto',
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: 'Sector CUIPO',
      dataIndex: 'sector_cuipo',
      key: 'sector_cuipo',
      sorter: (a, b) => a.sector_cuipo.localeCompare(b.sector_cuipo),
    },
    {
      title: 'Secretaría',
      dataIndex: 'secretaria',
      key: 'secretaria',
      sorter: (a, b) => a.secretaria.localeCompare(b.secretaria),
    }
  ];

  // Columnas para datos financieros
  const columnsFinancieros = [
    {
      title: 'Fondo',
      dataIndex: 'Fondo',
      key: 'Fondo',
    },
    {
      title: 'ID Proyecto',
      dataIndex: 'Proyecto_',
      key: 'Proyecto_',
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: 'Nombre',
      dataIndex: 'Nombre',
      key: 'Nombre',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Presupuesto Inicial',
      dataIndex: 'Ppto_Inicial',
      key: 'Ppto_Inicial',
      render: (text) => `$${parseFloat(text || 0).toLocaleString()}`,
    },
    {
      title: 'Total Presupuesto',
      dataIndex: 'Total_Ppto_actual',
      key: 'Total_Ppto_actual',
      render: (text) => `$${parseFloat(text || 0).toLocaleString()}`,
    },
    {
      title: 'Ejecución (%)',
      dataIndex: 'Ejecuci_n',
      key: 'Ejecuci_n',
      render: (text) => `${parseFloat(text || 0).toLocaleString()}%`,
    },
    {
      title: 'Disponible Neto',
      dataIndex: 'Disponible_neto',
      key: 'Disponible_neto',
      render: (text) => `$${parseFloat(text || 0).toLocaleString()}`,
    }
  ];

  const generarTitulo = () => {
    if (!filtros?.secretaria) return "Información de Proyectos";
    
    let titulo = `Proyectos de ${filtros.secretaria}`;
    if (filtros.sector) titulo += ` - Sector: ${filtros.sector}`;
    if (filtros.nombreProyecto) titulo += ` - ${filtros.nombreProyecto}`;
    
    return titulo;
  };

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  if (!filtros?.secretaria) {
    return <Alert message="Seleccione una secretaría para ver los proyectos" type="info" showIcon />;
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <Title level={4} style={{ marginBottom: '24px' }}>
        {generarTitulo()}
      </Title>
      
      <Spin spinning={loading}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Información General" key="1">
            <Table
              columns={columnsPlantilla}
              dataSource={datos.plantilla}
              rowKey={(record) => record.proyecto || record.nombre_proyecto}
              pagination={{ pageSize: 5, showSizeChanger: true }}
              bordered
              style={{ marginBottom: '24px' }}
              locale={{
                emptyText: 'No se encontraron proyectos con los filtros seleccionados'
              }}
            />
          </TabPane>
          
          {(filtros.proyecto || filtros.nombreProyecto) && (
            <TabPane tab="Ejecución Presupuestal" key="2">
              {datos.financieros.length > 0 ? (
                <Table
                  columns={columnsFinancieros}
                  dataSource={datos.financieros}
                  rowKey="Proyecto_"
                  pagination={{ pageSize: 5 }}
                  bordered
                  scroll={{ x: true }}
                />
              ) : (
                <Alert 
                  message="No se encontraron datos financieros para este proyecto" 
                  type="info" 
                  showIcon 
                />
              )}
            </TabPane>
          )}
        </Tabs>
      </Spin>
    </div>
  );
};

export default ProyectosList;