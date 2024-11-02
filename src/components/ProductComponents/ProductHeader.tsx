import { Button } from "../CustomComponents/CustomButton"
import { Input } from "../CustomComponents/CustomInput"
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Editor } from 'primereact/editor';
import { InputSwitch } from 'primereact/inputswitch';
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from 'primereact/dropdown';
import { ColorPicker, ColorPickerHSBType, ColorPickerRGBType } from 'primereact/colorpicker';


import { MdOutlineLibraryAdd, LuSearch } from "@/utils/icons";
import { ICreateProduct } from "@/interfaces";
import { useBoolean } from '@/hooks/useBoolean';

import { useForm, SubmitHandler } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useProductsStore } from "@/stores";

import { useState } from "react";

const productSchema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập tên sản phẩm!'),
    price: yup.number().required('Vui lòng nhập giá sản phẩm!'),
    categoryId: yup.string().required('Vui lòng nhập loại sản phẩm!'),
    slug: yup.string().required('Vui lòng nhập nội dung!')
  })

export const ProductHeader = () => {
    const postProduct = useProductsStore((state) => state.postProduct);

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
        postProduct(data);
        reset();
        toggle();
      }

    const [description, setDescription] = useState('');
    const [checked, setChecked] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);
    const [category, setCategory] = useState(null);
    const [color, setColor] = useState<string | ColorPickerRGBType | ColorPickerHSBType>('');
  return (
    <div className='flex flex-row w-[95%] h-[50px] justify-between m-auto mt-6'>
        <div className='text-black-light text-2xl font-bold leading-tight text-left'>Thông tin sản phẩm</div>
        <div className="flex flex-row gap-5">
            <IconField iconPosition="left">
                <InputIcon>
                    <LuSearch size={20} color="gray" className="pb-1"/>
                </InputIcon>
                <Input name="search" placeholder="Search" className="rounded-lg w-[270px]"/>
            </IconField>
            <Button className="rounded-lg" onClick={toggle}>
                <MdOutlineLibraryAdd size={20} color="white"/>
            </Button>
            {value && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50" onClick={toggle}>
                <div className="bg-white rounded-lg shadow-lg p-6 h-fit w-[80%]" onClick={(e) => e.stopPropagation()}>
                    <div className="text-xl font-bold mb-4">
                        Thêm sản phẩm
                    </div>
                    <form onSubmit={handleSubmit(addProduct)} className="w-full flex flex-row">
                        <div className="w-[65%] h-fit flex flex-col gap-4">
                            <label className="font-semibold">
                                Tên sản phẩm
                                <Input 
                                name="name"
                                control={control}
                                errors={errors}
                                placeholder="Tên sản phẩm"
                                className="w-full mt-2"/>
                            </label>
                            <div className="w-full flex flex-row h-fit justify-between">
                                <label className="font-semibold">
                                    Mã sản phẩm
                                <Input 
                                    name="slug"
                                    control={control}
                                    errors={errors}
                                    placeholder="Mã sản phẩm"
                                    className="w-full mt-2"/>
                                </label>
                                <label className="font-semibold">
                                    Giá sản phẩm
                                    <Input 
                                    name="price"
                                    control={control}
                                    errors={errors}
                                    placeholder="Giá sản phẩm"
                                    className="w-full mt-2"/>
                                </label>
                                <label className="font-semibold">
                                    Ưu đãi  
                                <Input 
                                    name="discount"
                                    control={control}
                                    errors={errors}
                                    placeholder="Ưu đãi"
                                    className="w-full mt-2"/>
                                </label>
                            </div>
                            <label className="font-semibold">
                                Mô tả sản phẩm
                                <Editor value={description} onTextChange={(e) => setDescription(e.htmlValue || '')} style={{ height: '300px' }} className="mt-2"/>
                            </label>
                        </div>
                        <div className="w-[35%] h-fit flex flex-col justify-between px-4 gap-3">
                            <label className="font-semibold">
                                Loại sản phẩm
                                <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={['Quần','Áo','Áo thun','Áo sơ mi','Quần dài']} optionLabel="name" 
                                    placeholder="Chọn loại sản phẩm" className="w-full md:w-14rem mt-2" checkmark={true}  highlightOnSelect={false} />
                            </label>
                            <label className="font-semibold">
                                Kích thước sản phẩm
                                <Dropdown value={category} onChange={(e) => setCategory(e.value)} options={['XS','S','M','L','XL','XXL','XXXL']} optionLabel="name" 
                                    placeholder="Chọn kích thước" className="w-full md:w-14rem mt-2" checkmark={true}  highlightOnSelect={false} />
                            </label>
                            <label className="font-semibold">
                                Hình ảnh mẫu
                                <FileUpload name="demo[]" url={'/api/upload'} multiple accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Thêm hình ảnh cho sản phẩm</p>} 
                                className="mt-2"/>
                            </label>
                            <div className="flex flex-row h-[60px] w-full border rounded-md justify-between items-center">
                                <div className="text-lg font-semibold m-auto text-left ml-5">Chọn màu</div>
                                <ColorPicker value={color} onChange={(e) => setColor(e.value || '')} className="mr-6"/>
                            </div>
                            <div className="flex flex-row h-[60px] w-full border rounded-md justify-between items-center">
                                <div className="text-lg font-semibold m-auto text-left ml-5">Còn hàng</div>
                                <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} className="mr-4"/>
                            </div>
                            <div className="flex flex-row w-[75%] m-auto gap-5">
                                <Button htmlType="submit" className="w-[50%] bg-primary border-primary text-white rounded-lg py-2 hover:bg-primary-dark transition">
                                    Thêm sản phẩm
                                </Button>
                                <Button onClick={toggle} className="w-[50%] bg-green border-green text-white rounded-lg py-2 hover:bg-green-dark transition">
                                    Quay lại
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            )}
        </div>
    </div>
  )
}
