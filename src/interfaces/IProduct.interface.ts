export interface IProduct {   
    name: string;
    description: string;
    price: number;
    categoryId: string;
    slug: string;
    discount: number;
    createdAt: Date;
    updatedAt: Date;
}