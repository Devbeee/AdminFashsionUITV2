import { Button } from "../CustomComponents/CustomButton";
import * as yup from 'yup';
import { Input } from "../CustomComponents/CustomInput";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { MdOutlineLibraryAdd, LuSearch } from "@/utils/icons";
import { useBoolean } from '@/hooks/useBoolean';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
    name: yup.string().required('Tên sản phẩm không được để trống'),
    price: yup.number().required('Giá sản phẩm không được để trống').typeError('Giá sản phẩm phải là số'),
    discount: yup.number().typeError('Giảm giá phải là số').transform((value, originalValue) => originalValue === '' ? 0 : value).min(0, 'Giảm giá phải là số hợp lệ'),
    description: yup.string().required('Mô tả sản phẩm không được để trống'),
    categoryId: yup.object({
        value: yup.string().required("Vui lòng chọn danh mục sản phẩm"),
      }),
    size: yup.array().min(1, 'Chọn ít nhất một kích thước').required('Chọn ít nhất một kích thước'),
    numberOfColor: yup.number().required('Số lượng màu sắc không được để trống'),
    stock: yup.number().required('Số lượng sản phẩm không được để trống'),
    imgUrl: yup.string().url('Vui lòng chọn ảnh').required('Vui lòng chọn ảnh')
});

export const ProductHeader = () => {
    const dropdownIcon = `url('data:image/svg+xml;utf8,<svg fill="gray" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`;
    const [numberOfColor, setNumberOfColor] = useState(0);
    const { value, toggle } = useBoolean(false);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const categoryId = [
        { label: "Áo - Nam", value: "01" },
        { label: "Áo - Nữ", value: "02" },
        { label: "Quần - Nam", value: "03" },
        { label: "Quần - Nữ", value: "04" }
      ];
    const {
        control,
        handleSubmit,
        reset: resetContactForm,
        formState: { errors }
      } = useForm({
        resolver: yupResolver(schema)
      })
    

    const handleSizeChange = (size: string) => {
        setSelectedSizes((prevSizes) =>
            prevSizes.includes(size)
                ? prevSizes.filter((s) => s !== size)
                : [...prevSizes, size]
        );
    };

    const handleToggle = () => {
        toggle();
        setNumberOfColor(0);
        setSelectedSizes([]);
        resetContactForm();
    }
    const handleCreateProduct = () => {
        
    };

    return (
        <div className='flex flex-row w-[95%] h-fit justify-between m-auto mt-6'>
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
                <div className="fixed inset-0 h-full bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50" onClick={handleToggle}>
                    <div className="bg-white rounded-lg shadow-lg p-6 h-fit w-[80%]" onClick={(e) => e.stopPropagation()}>
                        <div className="text-xl font-bold mb-4">
                            Thêm sản phẩm
                        </div>
                        <form onSubmit={handleSubmit(handleCreateProduct)} className="">
                            <div className="flex flex-col gap-4">
                                <div className="w-full flex flex-row gap-4">
                                    <div className="w-[70%] h-fit flex flex-col gap-5">
                                        <div className="w-full h-fit flex flex-row gap-4 justify-between">
                                            <Input control={control} errors={errors} name="name" placeholder="Tên sản phẩm" className="w-full rounded-lg"/>
                                            <Input control={control} errors={errors} name="price" placeholder="Giá sản phẩm" className="w-full rounded-lg"/>
                                            <Input control={control} errors={errors} name="discount" placeholder="Giảm giá" className="w-full rounded-lg"/>
                                        </div>
                                        <div className="h-fit w-full">
                                            <Controller
                                                name="description"
                                                control={control}
                                                render={({ field }) => (
                                                    <Editor
                                                        value={field.value}
                                                        placeholder="Nội dung"
                                                        onTextChange={(e: EditorTextChangeEvent) => field.onChange(e.htmlValue || '')}
                                                        style={{ height: '350px', width: '100%' }}
                                                    />
                                                )}
                                            />
                                            {errors.description && (
                                                <span className="text-red">{errors.description.message}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-[30%] h-fit flex flex-col gap-4">
                                        <div className="h-fit w-full">
                                            <Controller
                                                name="categoryId"
                                                control={control}
                                                render={({ field }) => (
                                                    <select 
                                                    value={field.value?.value || ''}
                                                    onChange={(val) => field.onChange({ value: val.target.value })}
                                                    className="w-full border rounded-lg h-[48px] p-2 appearance-none bg-no-repeat pr-10" 
                                                    style={{ backgroundImage: dropdownIcon, backgroundPosition: 'right 10px center' }}
                                                    >
                                                        <option value="" disabled hidden>Chọn danh mục</option>
                                                        {categoryId.map((category) => (
                                                            <option key={category.value} value={category.value}>{category.label}</option>
                                                        ))}
                                                    </select>
                                                  )}
                                            />
                                            {errors.categoryId?.value && (
                                                <>
                                                    <br />
                                                    <span className="text-red">{errors.categoryId.value.message}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-4 border rounded-md p-3">
                                            <label className="font-semibold">Chọn kích thước</label>
                                            <div className="flex flex-row gap-4">
                                                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                                    <label key={size} className="flex items-center gap-2">
                                                        <input type="checkbox" name="size" value={size} className="form-checkbox h-5 w-5 rounded" onChange={() => handleSizeChange(size)} />
                                                        <span className="text-lg font-semibold text-gray-700">{size}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 border rounded-md p-2">
                                            <label className="font-semibold">Chọn màu sắc</label>
                                            <Input type="text" name="numberOfColor" onChange={(e) => setNumberOfColor(Number(e.target.value))} placeholder="Số lượng màu sắc" className="rounded-lg"/>
                                            {value && <div className={`flex flex-col gap-4 ${numberOfColor > 2 ? 'overflow-y-scroll h-[150px]' : ''}`}>
                                                {Array.from({ length: numberOfColor }).map((_, index) => (
                                                    <div key={index}>
                                                        <label className="font-semibold">Màu sắc {index + 1}</label>
                                                        <br />
                                                        <input type="color" name={`color_${index}`} className="rounded-lg w-full h-[30px]"/>
                                                    </div>
                                                ))}
                                            </div>}
                                        </div>
                                    </div>
                                </div> 
                                <div className={`flex flex-col gap-4  ${numberOfColor > 2 ? 'overflow-y-scroll h-[150px]' : ''}`}>
                                {Array.from({ length: numberOfColor }).map((_, colorIndex) => (
                                        <div key={colorIndex} className="mb-4">
                                            {selectedSizes.map((size, sizeIndex) => (
                                                <div key={sizeIndex} className="flex flex-row gap-40 m-auto justify-center items-center">
                                                    <span className="font-semibold text-xl text-blue-cyan">{`Kích thước ${size} - Màu sắc ${colorIndex + 1}: `}</span>
                                                    <label className="w-[300px] rounded-lg border p-2 pl-5 cursor-pointer text-center mb-2">
                                                        <input type="file" name={`file_${colorIndex}_${size}`}/>
                                                    </label>
                                                    <Input type="number" name={`stock_${colorIndex}_${size}`} placeholder="Số lượng sản phẩm" className="w-[300px] rounded-lg" />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-row w-full m-auto gap-5 justify-center items-center">
                                    <Button onClick={handleCreateProduct} className="w-[40%] bg-primary border-primary text-white rounded-lg py-2 hover:bg-primary-dark transition">
                                        Tạo sản phẩm
                                    </Button>
                                    <Button onClick={handleToggle} className="w-[40%] bg-green border-green text-white rounded-lg py-2 hover:bg-green-dark transition">
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
    );
};

export default ProductHeader;