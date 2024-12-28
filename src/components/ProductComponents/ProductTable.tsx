import { SetStateAction, useEffect, useState } from "react";
import { Paginator } from 'primereact/paginator';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from "primereact/progressspinner";

import { productApi } from "@/apis";
import { useApi } from "@/hooks";
import { ICategory, IProduct } from "@/interfaces";
import { sortFunctions } from "@/utils";

import { ProductRow } from "./ProductRow";

type ProductTableProps = {
    category: ICategory[];
    query: string;
    filter: keyof typeof sortFunctions;
    toggleProductChange: () => void;
    isProductChange: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({category, query, filter, isProductChange, toggleProductChange}) => {
    const [first, setFirst] = useState(0);
    const onPageChange = (event: { first: SetStateAction<number>}) => {
        setFirst(event.first);
    };

    const numberWithDotRegex = /\B(?=(\d{3})+(?!\d))/g;
    const { loading, callApi: callApiManageProduct } = useApi<void>()
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
        const sortProducts = (products: IProduct[]) => {
            const sortFunction = sortFunctions[filter as keyof typeof sortFunctions];
            return sortFunction ? sortFunction(products) : products;
        };
    
        return sortProducts([...products]).filter((product: IProduct) =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
    };
  return (
    <div className="h-full w-full">
        <DataTable 
            value={Array.isArray(products) && filterProducts().length > 0 ? filterProducts() .slice(first, first + 7) : []} 
            className='text-center w-full' dataKey='id'
            emptyMessage={
                loading ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <ProgressSpinner />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <p className="text-lg font-semibold">No Products Found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria.</p>
                    </div>
                )
            }
        >
            <Column 
                className="w-[8%]"
                alignHeader={'center'}
                header='Product Name'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className='text-sm font-semibold h-[58px] overflow-hidden text-center flex items-center justify-center'>
                        {rowData.name}
                    </div>
                )}
            />
            <Column 
                className="w-[8%]"
                alignHeader={'center'}
                header='Slug'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className='text-sm font-semibold h-[58px] overflow-hidden text-center flex items-center justify-center'>
                        {rowData.slug}
                    </div>
                )}
            />
            <Column                 
                className="w-[10%]"
                alignHeader={'center'}
                header='Category'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className='text-sm font-semibold h-[58px] overflow-hidden flex items-center'>
                        {rowData.category.gender + ' - ' + rowData.category.type}
                    </div>
                )}
            />
            <Column
                className="w-[40%]"
                alignHeader={'center'}
                header='Description'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className='text-sm font-semibold h-[58px] overflow-hidden'>
                        <span dangerouslySetInnerHTML={{ __html: rowData.description }}></span>
                    </div>
                )}
            />
            <Column
                className="w-[8%]"
                alignHeader={'center'}
                header='Price'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className='text-sm font-semibold h-[58px] overflow-hidden text-center flex items-center justify-center'>
                        {rowData.price.toString().replace(numberWithDotRegex, ".") + ' VND'}
                    </div>
                )}
            />
            <Column
                className="w-[8%]"
                alignHeader={'center'}
                header='Discount'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className='text-sm font-semibold h-[58px] overflow-hidden text-center flex items-center justify-center'>
                        {rowData.discount + '%'}
                    </div>
                )}
            />
            <Column
                className="w-[8%]"
                alignHeader={'center'}
                header='Created At'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className='text-sm font-semibold h-[58px] overflow-hidden text-center flex items-center justify-center'>
                        <span>{new Date(rowData.createdAt).toLocaleString()}</span>
                    </div>
                )}
            />
            <Column
                className="w-[8%]"
                alignHeader={'center'}
                header='Updated At'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className='text-sm font-semibold h-[58px] overflow-hidden text-center flex items-center justify-center'>
                        <span>{new Date(rowData.updatedAt).toLocaleString()}</span>
                    </div>
                )}
            />
            <Column
                className="w-[5%]"
                alignHeader={'center'}
                header='Action'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className="text-center">
                        <ProductRow 
                            productInfo={rowData} 
                            category={category} 
                            toggleProductChange={toggleProductChange} 
                        />
                    </div>
                )}
            />
        </DataTable>
        <Paginator first={first} rows={7} totalRecords={filterProducts().length} onPageChange={onPageChange}/>
    </div>
  )
}