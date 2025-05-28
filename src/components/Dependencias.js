import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Select, Spin, Card, Row, Col, Layout, Menu, Typography } from 'antd';
import { HomeOutlined, DownloadOutlined } from '@ant-design/icons';
import ProyectosList from './ProyectosList';
import '../styles/Dependencias.css';
import Navbar from './Navbar';

const { Option } = Select;
const { Header, Content } = Layout;
const { Title } = Typography;

const Dependencias = () => {
  const [secretarias, setSecretarias] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [nombresProyectos, setNombresProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentNav, setCurrentNav] = useState('home');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Carga inicial de todas las secretarías
  useEffect(() => {
    const fetchOpcionesIniciales = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/v1/cuipo/plantilla-opciones');
        const data = await response.json();
        console.log('Respuesta proyectos-list:', data)

        setSecretarias([...new Set(data.secretarias || [])].sort());
      } catch (error) {
        console.error('Error al cargar opciones iniciales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpcionesIniciales();
  }, []);

  // Cargar sectores cuando se selecciona una secretaría
  const handleSecretariaChange = async (secretaria) => {
    form.setFieldsValue({
      sector_cuipo: null,
      nombre_proyecto: null
    });
    
    if (!secretaria) {
      setSectores([]);
      setNombresProyectos([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5001/api/v1/cuipo/proyectos-list?secretaria=${encodeURIComponent(secretaria)}`
      );
      const data = await response.json();
      
      // Ajusta según la estructura real de tu respuesta
      setSectores(data.filtros?.sectores || []);
      setNombresProyectos([]); // Limpiar proyectos al cambiar secretaría
    } catch (error) {
      console.error('Error al cargar sectores:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar proyectos cuando se selecciona un sector
  const handleSectorChange = async (sector) => {
    form.setFieldsValue({ nombre_proyecto: null });
    
    if (!sector) {
      setNombresProyectos([]);
      return;
    }

    const secretaria = form.getFieldValue('secretaria');
    if (!secretaria) return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5001/api/v1/cuipo/proyectos-list?secretaria=${encodeURIComponent(secretaria)}&sector=${encodeURIComponent(sector)}`
      );
      const data = await response.json();
      
      // Asegúrate de usar la propiedad correcta de la respuesta
      setNombresProyectos(data.filtros?.nombreProyectos || []);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (e) => {
    setCurrentNav(e.key);

    if (e.key === 'home') {
      navigate('/cuipo');
    } else if (e.key === '/') {
      navigate('/');
    }
  };

  return (
    <Layout className="layout-container">
      <Navbar />
      <Header style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#1890ff',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            Ejecución Presupuestal por Dependencia
          </Title>
        </div>
        
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentNav]}
          onClick={handleNavClick}
          style={{ background: 'transparent', lineHeight: '64px' }}
        >
          <Menu.Item key="home" icon={<HomeOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key="download" icon={<DownloadOutlined />}>
            Download
          </Menu.Item>
        </Menu>
      </Header>

      <Content style={{ padding: '24px 50px', minHeight: 'calc(100vh - 64px)' }}>
        <div className="dependencias-container">
          <Card 
            bordered={false}
            headStyle={{
              backgroundColor: '#1890ff',
              color: 'white',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              padding: '16px 24px',
              fontSize: '18px',
              fontWeight: '500'
            }}
            bodyStyle={{
              padding: '24px',
              backgroundColor: '#f5f5f5'
            }}
            style={{
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              margin: '20px auto'
            }}
          >
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
              </div>
            ) : (
              <Form form={form} layout="vertical">
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={8}>
                    <Form.Item 
                      label={<span className="form-label">Secretaría</span>} 
                      name="secretaria"
                    >
                      <Select
                        placeholder="Seleccione una secretaría"
                        showSearch
                        style={{ width: '100%' }}
                        className="custom-select"
                        dropdownStyle={{
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                        onChange={handleSecretariaChange}
                        allowClear
                      >
                        {secretarias.map((sec, index) => (
                          <Option key={index} value={sec}>
                            {sec}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={8}>
                    <Form.Item 
                      label={<span className="form-label">Sector CUIPO</span>} 
                      name="sector_cuipo"
                    >
                      <Select
                        placeholder="Seleccione un sector CUIPO"
                        showSearch
                        style={{ width: '100%' }}
                        className="custom-select"
                        dropdownStyle={{
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                        onChange={handleSectorChange}
                        disabled={!form.getFieldValue('secretaria')}
                        allowClear
                      >
                        {sectores.map((sector, index) => (
                          <Option key={index} value={sector}>
                            {sector}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item 
                      label={<span className="form-label">Nombre Proyecto</span>}
                      name="nombre_proyecto"
                    >
                      <Select
                        placeholder="Seleccione un Proyecto"
                        showSearch
                        optionFilterProp='children'
                        style={{ width: '100%' }}
                        className="custom-select"
                        dropdownStyle={{
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                        disabled={!form.getFieldValue('sector_cuipo')}
                        allowClear
                      >
                        {nombresProyectos.map((proyecto, index) => (
                          <Option key={`proyecto-${index}`} value={proyecto}>
                            {proyecto}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            )}
          </Card>

          {/* Componente para mostrar los proyectos filtrados */}
          <Card 
            style={{ 
              marginTop: '24px', 
              borderRadius: '8px',
              overflow: 'hidden' // Para bordes redondeados consistentes
            }}
            title={`Proyectos ${form.getFieldValue('secretaria') ? `de ${form.getFieldValue('secretaria')}` : ''}`}
          >
            <div style={{ padding: '16px' }}>
              <ProyectosList 
                filtros={{
                  secretaria: form.getFieldValue('secretaria'),
                  sector: form.getFieldValue('sector_cuipo'),
                  nombreProyecto: form.getFieldValue('nombre_proyecto')
                }}
              />
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default Dependencias;