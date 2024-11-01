import React from 'react'
import { Input } from '../CustomComponents/CustomInput';
import { Button } from 'primereact/button';

import { IProduct, IUpdateProduct } from '@/interfaces';
import { LuSearch } from '@/utils/icons';
import { useBoolean } from '@/hooks/useBoolean';

import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'


const productSchema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập tên sản phẩm!'),
    price: yup.number().required('Vui lòng nhập giá sản phẩm!'),
    categoryId: yup.string().required('Vui lòng nhập loại sản phẩm!'),
    slug: yup.string().required('Vui lòng nhập nội dung!'),
    discount: yup.number().required('Vui lòng nhập giảm giá!'),
    description: yup.string().required('Vui lòng nhập mô tả!'),
  })

export const ProductRow: React.FC<IProduct> = ({name, description, price, categoryId, slug, discount, createdAt, updatedAt}) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(productSchema)
    })

    const updateProduct: SubmitHandler<IUpdateProduct> = (data) => {
        // fetch('http://localhost:3000/api/product', {
        //   method: 'POST',
        //   headers: {
        //   'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(data)
        // })
        // .then((response) => {
        //   if (response.ok) {
        //     reset();
        //   } else {
        //     throw new Error('Failed to send contact information');
        //   }
        // })
        // .catch((error) => {
        //   throw new Error(error);
        // });
        console.log(data)
      }

      const { value: showProduct, toggle: toggleProduct } = useBoolean(false);
      const { value: showForm, toggle: toggleForm } = useBoolean(false);
      const { value: showDelete, toggle: toggleDelete } = useBoolean(false);

    const deleteHandler = () => {
        toggleDelete();
        toggleProduct();
        console.log('delete');
    }   

  return (
    <>
        <div className='flex flex-row h-[80px] p-[10px] gap-[10px]'>
            <div className='w-[15%] pl-[12px] m-auto'>
                <div className='text-black-light opacity-80 text-sm font-semibold'>{name}</div>
            </div>
            <div className='w-[20%] pl-[12px] m-auto'>
                <div className='text-black-light opacity-80 text-sm font-semibold'>{description}</div>
            </div>
            <div className='w-[10%] pl-[12px] m-auto'>
                <div className='text-black-light opacity-80 text-sm font-semibold'>{price} VND</div>
            </div>
            <div className='w-[10%] pl-[12px] m-auto'>
                <div className='text-black-light opacity-80 text-sm font-semibold'>{categoryId}</div>
            </div>
            <div className='w-[15%] pl-[12px] m-auto'>
                <div className='text-black-light opacity-80 text-sm font-semibold'>{slug}</div>
            </div>
            <div className='w-[10%] pl-[12px] m-auto'>
                <div className='text-black-light opacity-80 text-sm font-semibold'>{discount}</div>
            </div>
            <div className='w-[20%] pl-[12px] m-auto'>
                <div className='text-black-light opacity-80 text-sm font-semibold'>{createdAt.toString()}</div>
            </div>
            <div className='w-[20%] pl-[12px] m-auto'>
                <div className='text-black-light opacity-80 text-sm font-semibold'>{updatedAt.toString()}</div>
            </div>
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
                        </div>
                        <div className='flex flex-row h-[80px] p-[10px] gap-[10px]'>
                            <div className='w-[15%] pl-[12px] m-auto'>
                                <div className='text-black-light opacity-80 text-sm font-semibold'>{name}</div>
                            </div>
                            <div className='w-[20%] pl-[12px] m-auto'>
                                <div className='text-black-light opacity-80 text-sm font-semibold'>{description}</div>
                            </div>
                            <div className='w-[10%] pl-[12px] m-auto'>
                                <div className='text-black-light opacity-80 text-sm font-semibold'>{price} VND</div>
                            </div>
                            <div className='w-[10%] pl-[12px] m-auto'>
                                <div className='text-black-light opacity-80 text-sm font-semibold'>{categoryId}</div>
                            </div>
                            <div className='w-[15%] pl-[12px] m-auto'>
                                <div className='text-black-light opacity-80 text-sm font-semibold'>{slug}</div>
                            </div>
                            <div className='w-[10%] pl-[12px] m-auto'>
                                <div className='text-black-light opacity-80 text-sm font-semibold'>{discount}</div>
                            </div>
                            <div className='w-[20%] pl-[12px] m-auto'>
                                <div className='text-black-light opacity-80 text-sm font-semibold'>{createdAt.toString()}</div>
                            </div>
                            <div className='w-[20%] pl-[12px] m-auto'>
                                <div className='text-black-light opacity-80 text-sm font-semibold'>{updatedAt.toString()}</div>
                            </div>
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
                                        Tên sản phẩm:
                                        <Controller
                                            name="name"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} className="border rounded-lg p-2 w-full"/>
                                            )}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Giá:
                                        <Controller
                                            name="price"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} className="border rounded-lg p-2 w-full"/>
                                            )}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Danh mục:
                                        <Controller
                                            name="categoryId"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} className="border rounded-lg p-2 w-full"/>
                                            )}
                                        />                        
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 w-1/2">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Mã sản phẩm:
                                        <Controller
                                            name="slug"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} className="border rounded-lg p-2 w-full"/>
                                            )}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Ưu đãi:
                                        <Controller
                                            name="discount"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} className="border rounded-lg p-2 w-full"/>
                                            )}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Mô tả sản phẩm:
                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} className="border rounded-lg p-2 w-full"/>
                                            )}
                                        />
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
    </>
  )
}
