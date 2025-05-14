import React, { useState } from 'react';
import { Input, Button, Select, Form, notification } from 'antd';
import axios from 'axios';

const FormPage = () => {
    const [form] = Form.useForm();
    const [codigo, setCodigo] = useState('');
    const [validador, setValidador] = useState('FAVOR DILIGENCIAR CPC');

    const handleSearch = async (value) => {
        try {
            const response = await axios.get('http://localhost:5001/api/v1/cuipo/cpc-opciones', { params: { query: value } });

            if (response.data) {
                setValidador('CPC OK');
                notification.success({ message: 'Código encontrado correctamente' });
            } else {
                setValidador('FAVOR DILIGENCIAR CPC');
            }
        } catch (error) {
            console.error(error);
            notification.error({ message: 'Error al obtener las opciones de CPC' });
        }
    };

    return (
        <div>
            <h1>Formulario de Código CPC</h1>

            <Form form={form} layout="vertical">
                <Form.Item label="Código y Nombre del CPC">
                    <Input
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        onBlur={() => handleSearch(codigo)}
                        placeholder="Buscar código y nombre del CPC"
                    />
                </Form.Item>

                <Form.Item label="Validador CPC">
                    <Select value={validador} disabled>
                        <Select.Option value="FAVOR DILIGENCIAR CPC">FAVOR DILIGENCIAR CPC</Select.Option>
                        <Select.Option value="CPC OK">CPC OK</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" onClick={() => handleSearch(codigo)}>
                        Validar CPC
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default FormPage;
