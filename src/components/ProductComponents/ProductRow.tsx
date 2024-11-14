import { productApi } from '@/apis';
import { useBoolean, useApi } from '@/hooks';
import { ICategory, ICreateProductDetail, IInputProduct, IProduct } from '@/interfaces';
import { Input, Button } from '@/components';

import { icons } from '@/utils/icons';
import { schema, sizes } from '@/utils/constants';
import { uploadToCloudinary } from '@/utils/helpers';

import { yupResolver } from '@hookform/resolvers/yup';

import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Button as PrimeBtn } from 'primereact/button';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';

import { useRef, SetStateAction, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';

type ProductRowProps = {
    productInfo: IProduct;
    toggleProductChange: () => void;
    setProducts: React.Dispatch<SetStateAction<IProduct[]>>;
    category: ICategory[];
}

export const ProductRow: React.FC<ProductRowProps> = ({productInfo, toggleProductChange, setProducts, category}) => { 
    const [categoryType, setCategoryType] = useState<string[]>([]);
    const [categoryGender, setCategoryGender] = useState<string[]>([]);
    Array.from(category).forEach(cate => {
        if (!categoryType.includes(cate.type)) {
            setCategoryType([...categoryType, cate.type])
        }
        if (!categoryGender.includes(cate.gender)) {
            setCategoryGender([...categoryGender, cate.gender])
        }
      })
    const toast = useRef<Toast>(null);
    const fileUploadReference = useRef<FileUpload>(null);
    const { value: showDropDown, toggle: toggleShowDropDown } = useBoolean(false);
    const { value: showProductDetail, toggle: toggleShowProductDetail } = useBoolean(false);
    const { value: showConfirmDelete, toggle: toggleShowConfirmDelete } = useBoolean(false);
    const { loading, errorMessage, callApi: callApiManageProduct } = useApi<void>()
    
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
            colorNames: [],
            sizes: [],
            colors: [],
            imgUrls: [],
            stocks: []
        }
    })
      const handleToggle = () => {
        toggleShowProductDetail();
        toggleShowDropDown();
        resetProductForm();
        setValue('sizes', []);
        setValue('colors', []);
        setValue('imgUrls', []);
        setValue('stocks', []);
    }

    const handleResetForm = () => {
        productInfo.productDetails.forEach((detail) => {
            const sizeIndex = productInfo.productDetails.findIndex(d => d.size === detail.size);
            const colorIndex = watch('colors').indexOf(detail.color);
            const index = sizeIndex * watch('colors').length + colorIndex;
            
            setValue(`imgUrls.${index}`, detail.imgUrl);
            setValue(`stocks.${index}`, detail.stock);
        });
        resetProductForm({
            name: productInfo.name,
            price: productInfo.price,
            discount: productInfo.discount,
            description: productInfo.description,
            categoryGender: { value: productInfo.category.gender },
            categoryType: { value: productInfo.category.type },
            sizes: [...new Set(productInfo.productDetails.map(detail => detail.size))],
            colors: [...new Set(productInfo.productDetails.map(detail => detail.color))],
            numberOfColor: [...new Set(productInfo.productDetails.map(detail => detail.color))].length.toString(),
            colorNames: [...new Set(productInfo.productDetails.map(detail => detail.colorName))],
            imgUrls: watch('imgUrls'),
            stocks: watch('stocks'),
        });
    }

    useEffect(() => {
        handleResetForm();
    }, [showProductDetail])
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

    const deleteProduct = async (productId: string) => {
        setProducts(prevProducts => prevProducts.filter(product => product.id !== productId))
        callApiManageProduct(async () => {
            const { data } = await productApi.deleteProduct(productId)
            if (data) {
                toggleProductChange()
                toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
            } else {
                toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: `${errorMessage}`, life: 3000 });
            }
        })
    }
    
    const updateProduct = async (updateProductData: IInputProduct) => {
        callApiManageProduct(async () => {
            try {
            const productDetails: ICreateProductDetail[] = []
            updateProductData.sizes.forEach((size, sizeIndex) => {
                updateProductData.colors.forEach((color, colorIndex) => {
                    const colorName = updateProductData.colorNames[colorIndex];
                    const imgUrl = updateProductData.imgUrls[colorIndex + sizeIndex * updateProductData.colors.length] || '';
                    const stock = updateProductData.stocks[colorIndex + sizeIndex * updateProductData.colors.length];
                    color = color || '#000000';
                    productDetails.push({size, colorName, color, imgUrl, stock})
                })
            })

            const {numberOfColor, categoryGender, categoryType, sizes, colors, stocks, imgUrls, colorNames, ...updateProductInfo} = updateProductData;
            const categoryId = category.find((category) => category.type === categoryType.value && category.gender === categoryGender.value)?.id || '';
            const sendData = {...updateProductInfo, categoryId: categoryId, productDetails: productDetails, discount: updateProductInfo.discount || 0}
            const { data } = await productApi.updateProduct(productInfo.id, sendData)
                if (data) {
                    handleToggle()
                    toggleProductChange()
                    toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật sản phẩm thành công', life: 3000 });
                }
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: `${errorMessage}`,
                    life: 3000,
                });
            }
        })
    }
  return (
    <div className='flex flex-row h-[80px] p-[10px] gap-[10px]'>
        {[
            { width: '15%', value: productInfo.name },
            { width: '15%', value: productInfo.slug },
            { width: '10%', value: productInfo.category.type + ' - ' + productInfo.category.gender },
            { width: '20%', value: productInfo.description },
            { width: '10%', value: `${productInfo.price} VND` },
            { width: '10%', value: productInfo.discount || 0 },
            { width: '10%', value: new Date(productInfo.createdAt).toLocaleDateString() },
            { width: '10%', value: new Date(productInfo.updatedAt).toLocaleDateString() },
        ].map((item, value) => (
            <div key={value} className={`w-[${item.width}] pl-[12px] m-auto`}>
                <div className='text-black-light opacity-80 text-sm font-semibold' dangerouslySetInnerHTML={{ __html: item.value }}></div>
            </div>
        ))}
        <div className='w-[10%] pl-[12px] m-auto flex justify-center items-center'>
            <div className="relative">
                <PrimeBtn text onClick={toggleShowDropDown}>
                    {icons.list}
                </PrimeBtn>
                {showDropDown && (
                    <>
                        <div className='fixed inset-0 z-0' onClick={toggleShowDropDown}></div>
                        <div className="absolute right-0 mt-3 p-1 w-[130px] bg-white border border-gray-light rounded-md shadow-lg z-10" onClick={(e) => e.stopPropagation()}>
                            <div className="absolute top-[-6px] right-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white"></div>
                            <PrimeBtn onClick={toggleShowProductDetail} text className='flex w-full transition text-sm gap-2'>{icons.search}Chi tiết</PrimeBtn>
                            <PrimeBtn onClick={toggleShowConfirmDelete} text className='flex w-full transition text-sm text-red gap-2'>{icons.deleteProduct}Xóa</PrimeBtn>
                        </div>
                    </>
                )}
            </div>
            {showConfirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50" onClick={toggleShowConfirmDelete}>
                    <div className="bg-white rounded-lg shadow-lg p-6 w-fit" onClick={(e) => e.stopPropagation()}>
                        <div className="text-lg font-bold mb-4">
                            Xác nhận xóa sản phẩm
                        </div>
                        <div className="mb-4">
                            Bạn có chắc chắn muốn xóa sản phẩm này không?
                        </div>
                        <div className="flex flex-row justify-between gap-4 w-[60%] m-auto">
                            <PrimeBtn onClick={() => deleteProduct(productInfo.id)} className="w-[180px] justify-center items-center bg-red border-red text-white rounded-lg py-2 hover:bg-red-dark transition"
                                disabled={loading} loading={loading}>
                                Xóa
                            </PrimeBtn>
                            <PrimeBtn onClick={toggleShowConfirmDelete} className="w-[180px] justify-center items-center bg-green border-green text-white rounded-lg py-2 hover:bg-green-dark transition">
                                Hủy bỏ
                            </PrimeBtn>
                        </div>
                    </div>
                </div>
            )}
            {showProductDetail && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50" onClick={toggleShowProductDetail}>
                <div className="relative bg-white rounded-lg shadow-lg p-6 w-fit" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-row text-xl font-bold mb-4 justify-between">
                        <p className="flex justify-center items-center text-2xl">Thêm sản phẩm</p>
                        <PrimeBtn text onClick={handleToggle} className="absolute right-2 top-2">
                            {icons.closePopup}
                        </PrimeBtn>
                    </div>
                    <form onSubmit={handleSubmit(updateProduct)} className="w-fit">
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
                                                    style={{ height: '375px', width: '100%' }}
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
                                            name="categoryType"
                                            control={control}
                                            render={({ field }) => (
                                                <select 
                                                value={field.value?.value || ''}
                                                onChange={(val) => field.onChange({ value: val.target.value })}
                                                className={`w-full border border-gray-border rounded-lg h-[48px] p-2 appearance-none bg-no-repeat pr-10 text-xl ${errors.categoryType?.value ? "border-red":''}`} 
                                                style={{ backgroundImage: icons.dropdownIcon, backgroundPosition: 'right 10px center' }}
                                                >
                                                    <option value="" disabled hidden>Chọn loại sản phẩm</option>
                                                    {categoryType.map((category) => (
                                                        <option key={category} value={category}>{category}</option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                        {errors.categoryType?.value && (
                                            <span className="text-red">{errors.categoryType.value.message}</span>
                                        )}
                                    </div>
                                    <div className="h-fit w-full flex flex-col">
                                        <Controller
                                            name="categoryGender"
                                            control={control}
                                            render={({ field }) => (
                                                <select 
                                                value={field.value?.value || ''}
                                                onChange={(val) => field.onChange({ value: val.target.value })}
                                                className={`w-full border border-gray-border rounded-lg h-[48px] p-2 appearance-none bg-no-repeat pr-10 text-xl ${errors.categoryGender?.value ? "border-red":''}`} 
                                                style={{ backgroundImage: icons.dropdownIcon, backgroundPosition: 'right 10px center' }}
                                                >
                                                    <option value="" disabled hidden>Chọn giới tính</option>
                                                    {categoryGender.map((category) => (
                                                        <option key={category} value={category}>{category}</option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                        {errors.categoryGender?.value && (
                                            <span className="text-red">{errors.categoryGender.value.message}</span>
                                        )}
                                    </div>
                                    <div className={`flex flex-col gap-4 border border-gray-border rounded-md p-3 ${errors.sizes ? "border-red":''}`}>
                                        <label className="font-semibold text-xl">Chọn kích thước</label>
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
                                                            className="rounded-lg size-4"
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
                                        <label className="font-semibold text-xl">Số lượng màu sản phẩm</label>
                                        <Input control={control} errors={errors} type="text" name="numberOfColor" placeholder="Số màu" className="w-full rounded-lg"/>
                                        {showProductDetail && <div className={`${Number(watch('numberOfColor')) > 2 ? 'overflow-y-scroll h-[150px]' : ''}`}>
                                            {Array.from({ length: Number(watch('numberOfColor')) }).map((_, index) => (
                                                <div key={index} className="flex flex-row w-full justify-between">
                                                    <label className="font-semibold">
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
                                                    <label className="font-semibold">
                                                        <p>Tên màu sắc {index + 1}</p>
                                                        <Input name={`colorNames.${index}`} control={control} errors={errors}/>
                                                        {errors.colorNames?.[index] && <span className="text-red">{errors.colorNames[index].message}</span>}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>}
                                    </div>
                                </div>
                            </div> 
                            <div className={`${Number(watch('numberOfColor')) > 1 && watch('sizes').length !==0 
                                ? 'overflow-y-scroll h-fit max-h-[250px]' : ''}`}>
                            {Array.from({ length: Number(watch('numberOfColor')) }).map((_, colorIndex) => (
                                    <div key={colorIndex} className="mb-4">
                                        {watch('sizes').map((size, sizeIndex) => {
                                            const index = sizeIndex * watch('colors').length + colorIndex;
                                            return (
                                                <div key={index} className="flex flex-row gap-32 justify-center items-center mb-5">
                                                <div className="flex flex-row w-[270px] font-semibold text-xl text-black text-left justify-between">
                                                    <p className="w-[65%]">{`Kích thước ${size}`}</p>
                                                    <p className="mr-3">-</p>
                                                    <p className="w-[45%]">{`Màu ${watch('colorNames')[colorIndex]}`}</p>
                                                </div>
                                                <div className="flex flex-row gap-2 justify-center items-center">
                                                    {!watch(`imgUrls.${index}`) &&
                                                        <Controller
                                                        name={`imgUrls.${index}`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <FileUpload
                                                                ref={fileUploadReference}
                                                                mode="basic"
                                                                accept="image/*"
                                                                maxFileSize={1500000}
                                                                auto
                                                                customUpload
                                                                uploadHandler={async (e) => {
                                                                    const url = await handleUpload(e);
                                                                    if (url) {
                                                                        field.onChange(url);
                                                                    }
                                                                }}
                                                                chooseLabel="Chọn ảnh"
                                                            />
                                                        )}
                                                        />
                                                    }
                                                    {watch('imgUrls').length === 0 || errors.imgUrls?.[index] && <span className="text-red">{errors.imgUrls.message}</span>}
                                                    <div className="w-[85px] h-[85px] relative group">
                                                        {watch(`imgUrls.${index}`) && (
                                                            <div className="relative">
                                                                <a href={watch(`imgUrls.${index}`)} target="_blank" rel="noopener noreferrer">
                                                                    <img src={watch(`imgUrls.${index}`)} alt={`Product ${index}`} className="w-[85px] h-[85px] object-cover mt-2" />
                                                                </a>
                                                                <button
                                                                    type="button"
                                                                    className="absolute top-0 right-0 bg-red text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    onClick={() => {
                                                                        const newImgUrls = [...watch('imgUrls')];
                                                                        newImgUrls[index] = '';
                                                                        if (fileUploadReference.current) {
                                                                            fileUploadReference.current.clear();
                                                                        }
                                                                        setValue('imgUrls', newImgUrls);
                                                                    }}
                                                                >
                                                                    X
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-[400px] h-fit">
                                                    <Input name={`stocks.${index}`} control={control} errors={errors.stocks} placeholder="Số lượng sản phẩm" />
                                                    {errors.stocks?.[index] && <span className="text-red">{errors.stocks[index].message}</span>}
                                                </div>
                                            </div>
                                            )
                                            
                                        })} 
                                    </div>
                                ))}
                            </div>
                            {errorMessage && <span className='text-red mb-2 text-lg'>{errorMessage}</span>}
                        </div>
                        <div className="flex flex-row w-[50%] ml-auto gap-5 justify-end items-center">
                            <Button onClick={toggleShowProductDetail} className="w-[27%] bg-green border-green text-white rounded-lg py-2 hover:bg-green-dark transition text-xl">
                                Quay lại
                            </Button>
                            <Button 
                            htmlType="submit" 
                            disabled={loading} loading={loading}
                            className="w-[27%] bg-primary border-primary text-white rounded-lg py-2 hover:bg-primary-dark transition text-xl">
                                Cập nhật
                            </Button>
                        </div>
                    </form>
                </div>
            </div>)}
        </div>
    </div>
    )
}
