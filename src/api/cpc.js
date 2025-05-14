import axios from 'axios';

const API_URL = 'http://localhost:5001/api/v1/cuipo';  // Ajusta esta URL al puerto donde esté corriendo tu backend

export const getCpcOptions = async (query) => {
    try {
        const response = await axios.get(`${API_URL}/cpc-opciones`, {
            params: { query }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las opciones de CPC:', error);
        throw error;
    }
};
