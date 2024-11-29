import { SetStateAction, useEffect, useState } from "react";
import { Paginator } from 'primereact/paginator';

import { productApi } from "@/apis";
import { useApi } from "@/hooks";
import { ICategory, IProduct } from "@/interfaces";

import { ProductRow } from "./ProductRow";

type ProductTableProps = {
    category: ICategory[];
    query: string;
    filter: string;
    toggleProductChange: () => void;
    isProductChange: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({category, query, filter, isProductChange, toggleProductChange}) => {
    const [first, setFirst] = useState(0);
    const onPageChange = (event: { first: SetStateAction<number>}) => {
        setFirst(event.first);
    };

    const { callApi: callApiManageProduct } = useApi<void>()
    const [products, setProducts] = useState<IProduct[]>([])
    const getAllProducts = async () => {
        callApiManageProduct(async () => {
            const { data } = await productApi.findAllProducts()
            setProducts(data)
        })
    }
    useEffect(() => {
        getAllProducts()
    }, [isProductChange])
    
    const filterProducts = () => {
        return (filter === 'default' ? 
            products
         : [...products].sort((a,b) => {
            if (filter === 'name-asc') {
                return a.name.localeCompare(b.name)
            }
            if (filter === 'name-desc') {
                return b.name.localeCompare(a.name)
            }
            if (filter === 'price-asc') {
                return a.price - b.price
            }
            if (filter === 'price-desc') {
                return b.price - a.price
            }
            if (filter === 'date-asc') {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            }
            if (filter === 'date-desc') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
            return 0
        }))
        .filter(product => product.name.toLowerCase().includes(query))
    }
  return (
    <>
        <div className='flex flex-col h-[690px] w-full'>
            <div className='flex flex-row bg-white-blue h-[48px] p-[10px] gap-[10px] rounded-t-lg'>
                <div className='w-[15%] pl-3 m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Tên sản phẩm</div>
                </div>
                <div className='w-[15%] pl-3 m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Mã sản phẩm</div>
                </div>
                <div className='w-[10%] pl-3 m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Danh mục</div>
                </div>
                <div className='w-[20%] pl-3 m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Mô tả</div>
                </div>
                <div className='w-[10%] pl-3 m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Giá</div>
                </div>
                <div className='w-[10%] pl-3 m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Ưu đãi</div>
                </div>
                <div className='w-[10%] pl-3 m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Tạo vào</div>
                </div>
                <div className='w-[10%] pl-3 m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Cập nhật vào</div>
                </div>
                <div className='w-[10%] pl-3 m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'></div>
                </div>
            </div>
            <div className='divide-y-2 divide-gray-light'>
                {Array.isArray(products) && filterProducts().length > 0
                ? filterProducts()
                .slice(first, first + 8).map((product) => (
                <ProductRow key={product.id} productInfo={{...product}} toggleProductChange={toggleProductChange} setProducts={setProducts}
                category={category}/>
                ))
                : <div className='text-black-light opacity-80 text-center text-xl font-semibold pt-10'>Không có sản phẩm phù hợp</div>}
            </div>
        </div>
        <Paginator first={first} rows={8} totalRecords={filterProducts().length} onPageChange={onPageChange}/>
    </>
    
  )
}
