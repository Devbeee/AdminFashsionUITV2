import { Button } from "../CustomComponents/CustomButton"
import { Input } from "../CustomComponents/CustomInput"
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

import { MdOutlineLibraryAdd, LuSearch } from "@/utils/icons";
import { ICreateProduct } from "@/interfaces";
import { useBoolean } from '@/hooks/useBoolean';

import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const productSchema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập tên sản phẩm!'),
    price: yup.number().required('Vui lòng nhập giá sản phẩm!'),
    categoryId: yup.string().required('Vui lòng nhập loại sản phẩm!'),
    slug: yup.string().required('Vui lòng nhập nội dung!')
  })

export const ProductHeader = () => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(productSchema)
    })
    const { value, toggle } = useBoolean(false);
    const addProduct: SubmitHandler<ICreateProduct> = (data) => {
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
  return (
    <div className='flex flex-row w-[95%] h-[50px] justify-between m-auto mt-6'>
        <div className='text-black-light text-2xl font-bold leading-tight text-left'>Thông tin sản phẩm</div>
        <div className="flex flex-row gap-5">
            <IconField iconPosition="left">
                <InputIcon>
                    <LuSearch size={20} color="gray" className="pb-1"/>
                </InputIcon>
                <Input placeholder="Search" className="rounded-lg w-[270px]"/>
            </IconField>
            <Button className="rounded-lg" onClick={toggle}>
                <MdOutlineLibraryAdd size={20} color="white"/>
            </Button>
            {value && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50" onClick={toggle}>
                <div className="bg-white rounded-lg shadow-lg p-6 w-96" onClick={(e) => e.stopPropagation()}>
                    <div className="text-lg font-bold mb-4">
                        Thêm sản phẩm
                    </div>
                    <form onSubmit={handleSubmit(addProduct)}>
                        <div className="mb-4">
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
                        <div className="mb-4">
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
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Danh mục sản phẩm:
                                <Controller
                                    name="categoryId"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} className="border rounded-lg p-2 w-full"/>
                                    )}
                                />                        
                            </label>
                        </div>
                        <div className="mb-4">
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
                        <div className="w-full h-fit flex flex-row justify-between px-4 gap-3">
                            <Button htmlType="submit" className="w-[50%] bg-primary border-primary text-white rounded-lg py-2 hover:bg-primary-dark transition">
                                Thêm sản phẩm
                            </Button>
                            <Button onClick={toggle} className="w-[50%] bg-green border-green text-white rounded-lg py-2 hover:bg-green-dark transition">
                                Quay lại
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            )}
        </div>
    </div>
  )
}
