import { yupResolver } from "@hookform/resolvers/yup";

import { MdOutlineLibraryAdd, LuSearch } from "@/utils/icons";
import { uploadToCloudinary } from "@/utils/helpers";
import { schema } from "@/utils/constants";
import { sizes } from "@/utils/constants";
import { dropdownIcon } from "@/utils/icons";

import { productApi } from "@/apis";
import { ICreateProductDetail, IInputProduct } from "@/interfaces";
import { useApi, useBoolean } from "@/hooks";
import { Button, Input } from "@/components";

import { Toast } from 'primereact/toast';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { FileUpload } from 'primereact/fileupload';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';

import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";

export const ProductHeader = () => {
    const toast = useRef<Toast>(null);
    const {value: addProduct, toggle: toggleAddProduct } = useBoolean(false);
    const { loading, errorMessage, callApi: callApiSendProduct } = useApi<void>()

    const categoryId = [
        { label: "Áo - Nam", value: "01" },
        { label: "Áo - Nữ", value: "02" },
        { label: "Quần - Nam", value: "03" },
        { label: "Quần - Nữ", value: "04" }
      ];

    const {
        control,
        handleSubmit,
        reset: resetProductForm,
        formState: { errors },
        watch,
        setValue
      } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            sizes: [],
            colors: [],
            imgUrls: [],
            stocks: []
          }
      })

    useEffect(() => {
        const colorCount = Number(watch('numberOfColor')) || 0;
        const currentColors = watch('colors') || [];
        
        if (colorCount > currentColors.length) {
            setValue('colors', [
            ...currentColors,
            ...Array(colorCount - currentColors.length).fill('#000000'),
            ]);
        } else if (colorCount < currentColors.length) {
            setValue('colors', currentColors.slice(0, colorCount));
        }
    }, [watch('numberOfColor'), setValue, watch])

    const handleUpload = async (e: any) => {
        const file = e.files[0];
        const url = await uploadToCloudinary(file);
        return url ? url : null;
    }
    
    const handleToggle = () => {
        toggleAddProduct();
        resetProductForm();
        setValue('sizes', []);
        setValue('colors', []);
        setValue('imgUrls', []);
        setValue('stocks', []);
    }
    const handleCreateProduct = (productData: IInputProduct) => {
        callApiSendProduct(async () => {
            const productDetails: ICreateProductDetail[] = []
            productData.sizes.forEach((size, sizeIndex) => {
                productData.colors.forEach((color, colorIndex) => {
                    const imgUrl = productData.imgUrls[colorIndex + sizeIndex * productData.colors.length];
                    const stock = productData.stocks[colorIndex + sizeIndex * productData.colors.length];
                    color = color || '#000000';
                    productDetails.push({size, color, imgUrl, stock})
                })
            })
            const {numberOfColor, categoryId, sizes, colors, stocks, imgUrls, ...productInfo} = productData;
            const sendData = {...productInfo, categoryId: categoryId.value, productDetails: productDetails, discount: productInfo.discount || 0}
            const {data} = await productApi.createProduct(sendData);
            if (data) {
                handleToggle();
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Thêm sản phẩm thành công',
                    life: 3000,
                });
            }
        })
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
                <Button className="rounded-lg" onClick={toggleAddProduct}>
                    <MdOutlineLibraryAdd size={20} color="white"/>
                </Button>
                {addProduct && (
                <div className="fixed inset-0 h-full bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50" onClick={handleToggle}>
                    <div className="relative bg-white rounded-lg shadow-lg p-6 h-fit max-h-[850px] w-[80%]" onClick={(e) => e.stopPropagation()}>
                        <div className="text-xl font-bold mb-4">
                            Thêm sản phẩm
                        </div>
                        <form onSubmit={handleSubmit(handleCreateProduct)}>
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
                                                        placeholder="Mô tả sản phẩm"
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
                                        <div className="h-fit w-full flex flex-col">
                                            <Controller
                                                name="categoryId"
                                                control={control}
                                                render={({ field }) => (
                                                    <select 
                                                    value={field.value?.value || ''}
                                                    onChange={(val) => field.onChange({ value: val.target.value })}
                                                    className={`w-full border rounded-lg h-[48px] p-2 appearance-none bg-no-repeat pr-10 ${errors.categoryId?.value ? "border-red":''}`} 
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
                                                <span className="text-red">{errors.categoryId.value.message}</span>
                                            )}
                                        </div>
                                        <div className={`flex flex-col gap-4 border rounded-md p-3 ${errors.sizes ? "border-red":''}`}>
                                            <label className="font-semibold">Chọn kích thước</label>
                                            <div className="flex flex-row w-full gap-5">
                                                {sizes.map((size) => (
                                                    <div key={size}>
                                                        <Controller
                                                        name="sizes"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <>
                                                                <input
                                                                type="checkbox"
                                                                value={size}
                                                                checked={field.value.includes(size)}
                                                                onChange={() => {
                                                                    const newSize = field.value.includes(size)
                                                                    ? field.value.filter((item) => item !== size)
                                                                    : [...field.value, size];
                                                                    field.onChange(newSize);
                                                                }}
                                                                className="rounded-lg size-5"
                                                                />
                                                                <label className="ml-2 text-xl">{size}</label>
                                                            </>
                                                            )}
                                                        />
                                                        
                                                    </div>
                                                    ))}
                                            </div>
                                            {errors.sizes && <span className="text-red">{errors.sizes.message}</span>}
                                        </div>
                                        <div className="flex flex-col gap-2 p-2 w-full">
                                            <label className="font-semibold">Số lượng màu sản phẩm</label>
                                            <Input control={control} errors={errors} type="text" name="numberOfColor" placeholder="Số màu" className="w-full rounded-lg"/>
                                            {addProduct && <div className={`${Number(watch('numberOfColor')) > 2 ? 'overflow-y-scroll h-[150px]' : ''}`}>
                                                {Array.from({ length: Number(watch('numberOfColor')) }).map((_, index) => (
                                                    <label key={index} className="font-semibold">
                                                        <p>Màu sắc {index + 1}</p>
                                                        <Controller
                                                            name={`colors.${index}`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <input
                                                                {...field}
                                                                type="color"
                                                                className="rounded-lg w-full h-[40px]"
                                                                onChange={(e) => {
                                                                    const newColors = [...watch('colors')];
                                                                    newColors[index] = e.target.value;
                                                                    setValue('colors', newColors);
                                                                }}
                                                                value={field.value ? field.value : '#000000'}
                                                                />
                                                            )}
                                                        />
                                                    </label>
                                                ))}
                                            </div>}
                                        </div>
                                    </div>
                                </div> 
                                <div className={`${Number(watch('numberOfColor')) > 1 && watch('sizes').length !==0 
                                    ? 'overflow-y-scroll h-[150px]' : ''}`}>
                                {Array.from({ length: Number(watch('numberOfColor')) }).map((_, colorIndex) => (
                                        <div key={colorIndex} className="mb-4">
                                            {watch('sizes').map((size, sizeIndex) => {
                                                const index = sizeIndex * watch('colors').length + colorIndex;
                                                return (
                                                    <div key={index} className="flex flex-row gap-32 justify-center items-center mb-5">
                                                    <div className="flex flex-row w-[270px] font-semibold text-xl text-blue-cyan text-left justify-between">
                                                        <p className="w-[65%]">{`Kích thước ${size}`}</p>
                                                        <p className="mr-3">-</p>
                                                        <p className="w-[45%]">{`Màu sắc ${colorIndex + 1}`}</p>
                                                    </div>
                                                    <div className="flex flex-row gap-2">
                                                    <Controller
                                                        name={`imgUrls.${index}`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <FileUpload
                                                                mode="basic"
                                                                accept="image/*"
                                                                maxFileSize={1000000}
                                                                auto
                                                                customUpload
                                                                uploadHandler={async (e) => {
                                                                    const url = await handleUpload(e);
                                                                    if (url) {
                                                                        field.onChange(url);
                                                                    }
                                                                }}
                                                                chooseLabel="Browse"
                                                            />
                                                        )}
                                                        />
                                                        <Input name={`imgUrls.${index}`} control={control} errors={errors} placeholder="Đường dẫn hình ảnh"/>
                                                    </div>
                                                    <Input name={`stocks.${index}`} control={control} errors={errors} placeholder="Số lượng sản phẩm" />
                                                    {errors.stocks && <span className="text-red">{errors.stocks.message}</span>}
                                                </div>
                                                )
                                                
                                            })} 
                                        </div>
                                    ))}
                                </div>
                                {errorMessage && <span className='text-red mb-2 text-lg'>{errorMessage}</span>}
                                <div className="flex flex-row w-full m-auto gap-5 justify-center items-center">
                                    <Button 
                                    htmlType="submit" 
                                    disabled={loading} loading={loading}
                                    className="w-[25%] bg-primary border-primary text-white rounded-lg py-2 hover:bg-primary-dark transition">
                                        Tạo sản phẩm
                                    </Button>
                                    <Button onClick={handleToggle} className="w-[25%] bg-green border-green text-white rounded-lg py-2 hover:bg-green-dark transition">
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