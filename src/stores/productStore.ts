import { create } from "zustand";
import axios from "axios";
import { IProductStore } from "@/interfaces";

export const useProductsStore = create<IProductStore>((set) => ({
    products: [],
    getProducts: () => {
        axios.get('http://localhost:3000/api/product')
            .then((response) => {
                if (response.status === 200) {
                    set({products: response.data});
                } else {
                    throw new Error('Failed to get product information');
                }
            })
    },
    postProduct: (productInfo) => {
        axios.post('http://localhost:3000/api/product', productInfo)
            .then((response) => {
                if (response.status === 200) {
                    set((state) => ({products: [...state.products, response.data]}));
                } else {
                    throw new Error('Failed to send product information');
                }
            })
    }, 
    patchProduct: (updateInfo, id) => {
        axios.patch(`http://localhost:3000/api/product/${id}`, updateInfo)
            .then((response) => {
                if (response.status === 200) {
                    set((state) => ({products: state.products.map((product) => product.id === id ? response.data : product)}));
                } else {
                    throw new Error('Failed to update product information');
                }
            })
    },
    deleteProduct: (id) => {
        axios.delete(`http://localhost:3000/api/product/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    set((state) => ({products: state.products.filter((product) => product.id !== id)}));
                } else {
                    throw new Error('Failed to delete product information');
                }
            })  
    }
}));