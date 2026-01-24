import axios from 'axios';

// URL Backend Node.js
const API_URL = 'http://localhost:5000/api/production';

export const getProductionSummary = async () => {
    try {
        const response = await axios.get(`${API_URL}/summary`);
        // Mengembalikan data dari response.data.data sesuai struktur controller kita
        return response.data.data; 
    } catch (error) {
        console.error("Error fetching production summary:", error);
        throw error;
    }
};

export const createProductionLog = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/log`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating production log:", error);
        throw error;
    }
};

export const getDowntimeLogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/downtime`);
    console.log("Response dari Server:", response.data); // Tambahkan log ini
    return response.data.data; // Harus .data.data sesuai struktur controller kita
  } catch (error) {
    console.error(error);
    return []; // Return array kosong jika error agar aplikasi tidak crash
  }
};

export const closeDowntime = async (id) => {
    try {
        // Pastikan URL-nya mengarah ke ID yang spesifik
        const response = await axios.patch(`http://localhost:5000/api/production/downtime/${id}`);
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response); // Ini akan membantu melihat alasan gagal di Console
        throw error;
    }
};

export const getMachines = async () => {
    const response = await axios.get(`${API_URL}/machines`);
    return response.data.data;
};

export const addMachine = async (machineData) => {
    const response = await axios.post(`${API_URL}/machines`, machineData);
    return response.data;
};

export const getProductionLines = async () => {
    const response = await axios.get(`${API_URL}/lines`);
    return response.data.data;
};

export const addProductionLine = async (lineData) => {
    const response = await axios.post(`${API_URL}/lines`, lineData);
    return response.data;
};