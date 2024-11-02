import { ICreateProduct } from "./ICreateProduct.interface";
import { IProduct } from "./IProduct.interface";
import { IUpdateProduct } from "./IUpdateProduct.interface";

export interface IProductStore {
    products: IProduct[];
    getProducts: () => void;
    postProduct: (productInfo: ICreateProduct) => void;
    deleteProduct: (id: string) => void;
    patchProduct: (updateInfo: IUpdateProduct, id: string) => void;
}