import React from 'react'
import { Input } from '../CustomComponents/CustomInput';
import { Button } from 'primereact/button';

import { IProduct, IUpdateProduct } from '@/interfaces';
import { LuSearch } from '@/utils/icons';
import { useBoolean } from '@/hooks/useBoolean';

import { useForm, SubmitHandler } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useProductsStore } from "@/stores";
import { ProductFields } from '@/utils/constants';


const productSchema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập tên sản phẩm!'),
    price: yup.number().required('Vui lòng nhập giá sản phẩm!'),
    categoryId: yup.string().required('Vui lòng nhập loại sản phẩm!'),
    slug: yup.string().required('Vui lòng nhập nội dung!'),
    discount: yup.number().required('Vui lòng nhập ưu đãi!'),
    description: yup.string().required('Vui lòng nhập mô tả!'),
  })

export const ProductRow: React.FC<IProduct> = ({name, description, price, categoryId, slug, discount, createdAt, updatedAt}) => {

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(productSchema)
    })

    const { value: showProduct, toggle: toggleProduct } = useBoolean(false);
    const { value: showForm, toggle: toggleForm } = useBoolean(false);
    const { value: showDelete, toggle: toggleDelete } = useBoolean(false);

    const patchProduct = useProductsStore((state) => state.patchProduct);
    const deleteProduct = useProductsStore((state) => state.deleteProduct);

    const updateProduct: SubmitHandler<IUpdateProduct> = (data) => {
        patchProduct(data, 'id');
      }


    const deleteHandler = () => {
        deleteProduct('id');
        toggleDelete();
        toggleProduct();
    }   

  return (
    <div className='flex flex-row h-[80px] p-[10px] gap-[10px]'>
        {[
            { width: '15%', value: name },
            { width: '20%', value: description },
            { width: '10%', value: `${price} VND` },
            { width: '10%', value: categoryId },
            { width: '15%', value: slug },
            { width: '10%', value: discount },
            { width: '20%', value: createdAt.toString() },
            { width: '20%', value: updatedAt.toString() },
        ].map((item, value) => (
            <div key={value} className={`w-[${item.width}] pl-[12px] m-auto`}>
                <div className='text-black-light opacity-80 text-sm font-semibold'>{item.value}</div>
            </div>
        ))}
        <div className='w-[10%] pl-[12px] m-auto flex justify-center items-center'>
            <Button rounded raised text onClick={toggleProduct}>
                <LuSearch size={15} color="blue"/>
            </Button>
            {showProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50" onClick={toggleProduct}>
                <div className="bg-white rounded-lg shadow-lg p-6 w-[75%]" onClick={(e) => e.stopPropagation()}>
                    <div className="text-lg font-bold mb-4">
                        Thông tin sản phẩm
                    </div>
                    <div className='flex flex-row bg-white-blue h-[48px] p-[10px] gap-[10px] rounded-t-2xl'>
                        {ProductFields.map((field) => (
                            <div key={field.label} className={`w-[${field.width}] pl-[12px] m-auto`}>
                                <div className='text-black-light opacity-80 text-sm font-semibold'>{field.label}</div>
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-row h-[80px] p-[10px] gap-[10px]'>
                        {[
                            { width: '15%', value: name },
                            { width: '20%', value: description },
                            { width: '10%', value: `${price} VND` },
                            { width: '10%', value: categoryId },
                            { width: '15%', value: slug },
                            { width: '10%', value: discount },
                            { width: '20%', value: createdAt.toString() },
                            { width: '20%', value: updatedAt.toString() },
                        ].map((item, value) => (
                            <div key={value} className={`w-[${item.width}] pl-[12px] m-auto`}>
                                <div className='text-black-light opacity-80 text-sm font-semibold'>{item.value}</div>
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-row w-[50%] justify-between m-auto gap-5'>
                        <Button onClick={toggleForm} className='flex justify-center items-center w-[45%] bg-primary border-primary text-white rounded-lg py-2 hover:bg-primary-dark transition'>Cập nhật sản phẩm</Button>
                        <Button onClick={toggleProduct} className='flex justify-center items-center w-[45%] bg-green border-green text-white rounded-lg py-2 hover:bg-green-dark transition'>Quay lại</Button>
                        <Button onClick={toggleDelete} className='flex justify-center items-center w-[45%] bg-red border-red text-white rounded-lg py-2 hover:bg-red-dark transition'>Xóa sản phẩm</Button>
                    </div> 
                    {showDelete && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50" onClick={toggleDelete}>
                            <div className="bg-white rounded-lg shadow-lg p-6 w-fit" onClick={(e) => e.stopPropagation()}>
                                <div className="text-lg font-bold mb-4">
                                    Xác nhận xóa sản phẩm
                                </div>
                                <div className="mb-4">
                                    Bạn có chắc chắn muốn xóa sản phẩm này không?
                                </div>
                                <div className="flex flex-row justify-between gap-4 w-[60%] m-auto">
                                    <Button onClick={deleteHandler} className="w-[180px] justify-center items-center bg-red border-red text-white rounded-lg py-2 hover:bg-red-dark transition">
                                        Xóa
                                    </Button>
                                    <Button onClick={toggleDelete} className="w-[180px] justify-center items-center bg-green border-green text-white rounded-lg py-2 hover:bg-green-dark transition">
                                        Hủy bỏ
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>)}   
            {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50" onClick={toggleForm}>
                <div className="bg-white rounded-lg shadow-lg p-6 w-fit" onClick={(e) => e.stopPropagation()}>
                    <div className="text-lg font-bold mb-4">
                        Cập nhật sản phẩm
                    </div>
                    <form onSubmit={handleSubmit(updateProduct)} className="flex flex-col gap-4">
                    <div className="flex flex-row justify-between gap-4">
                        <div className="flex flex-col gap-4 w-1/2">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Tên sản phẩm
                                    <Input 
                                    name="name"
                                    control={control}
                                    errors={errors}
                                    placeholder="Tên sản phẩm"/>
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Giá
                                    <Input 
                                    name="price"
                                    control={control}
                                    errors={errors}
                                    placeholder="Giá sản phẩm"/>
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Danh mục
                                    <Input 
                                    name="categoryId"
                                    control={control}
                                    errors={errors}
                                    placeholder="Danh mục sản phẩm"/>                           
                                </label>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 w-1/2">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Mã sản phẩm
                                    <Input 
                                    name="slug"
                                    control={control}
                                    errors={errors}
                                    placeholder="Mã sản phẩm"/>
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Ưu đãi
                                    <Input 
                                    name="discount"
                                    control={control}
                                    errors={errors}
                                    placeholder="Ưu đãi"/>
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Mô tả sản phẩm
                                    <Input 
                                    name="description" 
                                    control={control}
                                    errors={errors}
                                    placeholder="Mô tả sản phẩm"/>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between gap-4 m-auto w-[70%]">
                        <Button type="submit" className="w-[200px] justify-center items-center bg-primary border-primary text-white rounded-lg py-2 hover:bg-primary-dark transition">
                            Cập nhật sản phẩm
                        </Button>
                        <Button onClick={toggleForm} className="w-[200px] justify-center items-center bg-red border-red text-white rounded-lg py-2 hover:bg-red-dark transition">
                            Hủy bỏ
                        </Button>
                    </div>
                </form>
                </div>
            </div>)}
        </div>
    </div>
    )
}
