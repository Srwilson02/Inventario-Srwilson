import {api} from "./api"; 

export const productService = {
    getAll: async () => {
        const response = await api.get('/products');
        return response.data
    },
    create: async (data: {name: string; grupo: string, price: string, quantidade: string}) => {
        const response = await api.post('/products', data);
        return response.data
    }
};