import { productApi } from "@/apis";
import { useApi, useBoolean } from "@/hooks";
import { ICategory, IProduct } from "@/interfaces";

import { ProductRow } from "./ProductRow";

import { Paginator } from 'primereact/paginator';
import { SetStateAction, useEffect, useState } from "react";

type ProductTableProps = {
    category: ICategory[];
    query: string;
    filter: string;
}

export const ProductTable: React.FC<ProductTableProps> = ({category, query, filter}) => {
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
                {Array.isArray(products) && 
                (filter === 'default' ? 
                    (getAllProducts(), products)
                 : products.sort((a,b) => {
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
                .slice(first, first + 8).map((product) => (
                <ProductRow key={product.id} productInfo={{...product}} toggleProductChange={toggleProductChange} setProducts={setProducts}
                category={category}/>
                ))}
            </div>
        </div>
        <Paginator first={first} rows={8} totalRecords={products.length} onPageChange={onPageChange}/>
    </>
    
  )
}
