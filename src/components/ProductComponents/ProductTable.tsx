import { ProductRow } from "./ProductRow";
import { Paginator } from 'primereact/paginator';
import { SetStateAction, useEffect, useState } from "react";
import { useProductsStore } from "@/stores";

export const ProductTable = () => {
    const [first, setFirst] = useState(0);
    const onPageChange = (event: { first: SetStateAction<number>}) => {
        setFirst(event.first);
    };
    const products = useProductsStore((state) => state.products);
    const getProducts = useProductsStore((state) => state.getProducts);

    useEffect(() =>{
        getProducts();
    },[])
  return (
    <>
        <div className='flex flex-col h-[770px] w-full'>
            <div className='flex flex-row bg-white-blue h-[48px] p-[10px] gap-[10px] rounded-t-lg'>
                <div className='w-[15%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Tên sản phẩm</div>
                </div>
                <div className='w-[20%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Mô tả</div>
                </div>
                <div className='w-[10%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Giá</div>
                </div>
                <div className='w-[10%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Danh mục</div>
                </div>
                <div className='w-[15%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Mã sản phẩm</div>
                </div>
                <div className='w-[10%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Ưu đãi</div>
                </div>
                <div className='w-[20%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Tạo vào</div>
                </div>
                <div className='w-[20%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'>Cập nhật vào</div>
                </div>
                <div className='w-[10%] pl-[12px] m-auto'>
                    <div className='text-black-light opacity-80 text-sm font-semibold'></div>
                </div>
            </div>
            <div className='divide-y'>
                {products.slice(first, first+9).map((product) => (
                <ProductRow key={product.id} {...product} />
                ))}
            </div>
        </div>
        <Paginator first={first} rows={9} totalRecords={28} onPageChange={onPageChange}/>
    </>
    
  )
}
