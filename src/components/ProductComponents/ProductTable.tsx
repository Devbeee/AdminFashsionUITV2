import { ProductRow } from "./ProductRow";
import { Paginator } from 'primereact/paginator';
import { SetStateAction, useState } from "react";

const products = [
    { name: "aa", description: "aa", price: 1, categoryId: "aa", slug: "aa", discount: 1, createdAt: new Date(), updatedAt: new Date() },
    { name: "ab", description: "aa", price: 2, categoryId: "aa", slug: "aa", discount: 2, createdAt: new Date(), updatedAt: new Date() },
    { name: "ac", description: "aa", price: 3, categoryId: "aa", slug: "aa", discount: 3, createdAt: new Date(), updatedAt: new Date() },
    { name: "ad", description: "aa", price: 4, categoryId: "aa", slug: "aa", discount: 4, createdAt: new Date(), updatedAt: new Date() },
    { name: "ae", description: "aa", price: 5, categoryId: "aa", slug: "aa", discount: 5, createdAt: new Date(), updatedAt: new Date() },
    { name: "af", description: "aa", price: 6, categoryId: "aa", slug: "aa", discount: 6, createdAt: new Date(), updatedAt: new Date() },
    { name: "ag", description: "aa", price: 7, categoryId: "aa", slug: "aa", discount: 7, createdAt: new Date(), updatedAt: new Date() },
    { name: "ah", description: "aa", price: 8, categoryId: "aa", slug: "aa", discount: 8, createdAt: new Date(), updatedAt: new Date() },
    { name: "ai", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "aasd", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "aasasd", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "aiqwe", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "aiq", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "ait", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "aiyg", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "aiaq", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "aiklk", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "aill", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "aikk", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "ai123", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "ai0am", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "ai23", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "ai0053", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "ai566", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "ai99", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "ai69", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "a", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "ab12312a", description: "aa", price: 9, categoryId: "aa", slug: "aa", discount: 9, createdAt: new Date(), updatedAt: new Date() },
];
export const ProductTable = () => {
    const [first, setFirst] = useState(0);

    const onPageChange = (event: { first: SetStateAction<number>}) => {
        console.log(event.first);
        setFirst(event.first);
    };
  return (
    <>
        <div className='flex flex-col h-full w-full'>
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
                </div>
            </div>
            <div className='divide-y'>
                {products.slice(first, first+9).map((product) => (
                <ProductRow key={product.name} {...product} />
                ))}
            </div>
        </div>
        <Paginator first={first} rows={9} totalRecords={28} onPageChange={onPageChange} />
    </>
    
  )
}
