import { productApi } from "@/apis";
import { useApi, useBoolean } from "@/hooks";
import { IProduct } from "@/interfaces";

import { ProductRow } from "./ProductRow";

import { Paginator } from 'primereact/paginator';
import { SetStateAction, useEffect, useState } from "react";

export const ProductTable = () => {
    const [first, setFirst] = useState(0);
    const onPageChange = (event: { first: SetStateAction<number>}) => {
        setFirst(event.first);
    };

    const { callApi: callApiManageProduct } = useApi<void>()
    const [products, setProducts] = useState<IProduct[]>([])
    const { value: isProductChange, toggle: toggleProductChange } = useBoolean(false);

    const getAllProducts = async () => {
        callApiManageProduct(async () => {
            const { data } = await productApi.findAllProducts()
            setProducts(data)
        })
    }
    useEffect(() => {
        getAllProducts()
    }, [isProductChange])

  return (
    <>
        <div className='flex flex-col h-[770px] w-full'>
            <div className='flex flex-row bg-white-blue h-[48px] p-[10px] gap-[10px] rounded-t-lg'>
                <div className='w-[15%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Tên sản phẩm</div>
                </div>
                <div className='w-[15%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Mã sản phẩm</div>
                </div>
                <div className='w-[10%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Danh mục</div>
                </div>
                <div className='w-[20%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Mô tả</div>
                </div>
                <div className='w-[10%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Giá</div>
                </div>
                <div className='w-[10%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Ưu đãi</div>
                </div>
                <div className='w-[10%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Tạo vào</div>
                </div>
                <div className='w-[10%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Cập nhật vào</div>
                </div>
                <div className='w-[10%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'></div>
                </div>
            </div>
            <div className='divide-y'>
                {Array.isArray(products) && products.slice(first, first + 9).map((product) => (
                <ProductRow key={product.id} productInfo={{...product}} toggleProductChange={toggleProductChange} setProducts={setProducts}/>
                ))}
            </div>
        </div>
        <Paginator first={first} rows={9} totalRecords={28} onPageChange={onPageChange}/>
    </>
    
  )
}
