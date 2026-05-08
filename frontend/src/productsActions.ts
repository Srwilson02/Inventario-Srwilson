import {api} from "./api";

export const getProducts = async () => { 
    const response = await api.get('/products');
    return response.data;
}   

export const saveProducts = async (name: string, grupo: string, preco: string, quantidade: string) => {
    const response = await api.post('/products', {
        name, 
        grupo,
        preco,
        quantidade
    });
    return response.data;
};