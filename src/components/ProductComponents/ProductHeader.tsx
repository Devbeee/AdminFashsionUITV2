import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { Toast } from 'primereact/toast';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { FileUpload } from 'primereact/fileupload';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import { Dropdown } from 'primereact/dropdown';
import { ColorPicker } from 'primereact/colorpicker';
import { Button as PrimeBtn } from 'primereact/button';

import { yupResolver } from "@hookform/resolvers/yup";

import { uploadToCloudinary } from "@/utils/helpers";
import { schema, sizes, filterOptions } from "@/utils/constants";
import { icons } from "@/utils/icons";

import { productApi } from "@/apis";
import { ICategory, ICreateProductDetail, IInputProduct } from "@/interfaces";
import { useApi, useBoolean } from "@/hooks";
import { Button, Input } from "@/components";

type ProductHeaderProps = {
    category: ICategory[];
    setQuery: (query: string) => void;
    setFilter: (filter: string) => void;
    toggleProductChange: () => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({category, setQuery, setFilter, toggleProductChange}) => {
    const [categoryType, setCategoryType] = useState<string[]>([]);
    const [categoryGender, setCategoryGender] = useState<string[]>([]);
    const [colorErrorMessage, setColorErrorMessage] = useState<string>('');
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

    const {value: showFilter, toggle: toggleFilter} = useBoolean(false);
    const {value: addProduct, toggle: toggleAddProduct } = useBoolean(false);
    const { loading, errorMessage, callApi: callApiSendProduct } = useApi<void>()

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
    useEffect(() => {
        const colorCount = Number(watch('numberOfColor')) || 0;
        const currentColors = watch('colors') || [];
        const currentColorNames = watch('colorNames') || [];
        
        if (colorCount > currentColors.length) {
            setValue('colors', [
            ...currentColors,
            ...Array(colorCount - currentColors.length).fill('#000000'),
            ], { shouldValidate: true });
            setValue('colorNames', [
            ...currentColorNames,
            ...Array(colorCount - currentColors.length).fill(''),
            ], { shouldValidate: true })
        } else if (colorCount < currentColors.length) {
            setValue('colors', currentColors.slice(0, colorCount));
            setValue('colorNames', currentColorNames.slice(0, colorCount));
        }
    }, [watch('numberOfColor'), setValue, watch])

    useEffect(() => {
        const colors = watch('colors') || [];
        const uniqueColors = new Set(colors);
      
        if (uniqueColors.size !== colors.length) {
          setColorErrorMessage('Màu sắc không được trùng nhau.');
        } else {
          setColorErrorMessage('');
        }
      }, [watch('numberOfColor'), watch('colors')]);
      
    useEffect(() => {
        const currentSizes = watch('sizes').length;
        const currentColors = Number(watch('numberOfColor'));
        if(currentSizes === 0 || currentColors === 0) {
            setValue('colorNames', []);
            setValue('colors', []);
            setValue('imgUrls', []);
            setValue('stocks', []);
        }
    },[watch('sizes'), watch('numberOfColor')])

    const handleUpload = async (e: { files: File[] }) => {
        const file = e.files[0];
        const url = await uploadToCloudinary(file);
        return url ? url : null;
    }
    
    const handleToggle = () => {
        toggleAddProduct();
        resetProductForm();
        setValue('sizes', []);
        setValue('colorNames', []);
        setValue('colors', []);
        setValue('imgUrls', []);
        setValue('stocks', []);
    }
    const handleCreateProduct = (productData: IInputProduct) => {
        callApiSendProduct(async () => {
            const productDetails: ICreateProductDetail[] = []
            productData.sizes.forEach((size, sizeIndex) => {
                productData.colors.forEach((color, colorIndex) => {
                    const colorName = productData.colorNames[colorIndex];
                    const imgUrl = productData.imgUrls[colorIndex + sizeIndex * productData.colors.length] || '';
                    const stock = productData.stocks[colorIndex + sizeIndex * productData.colors.length];
                    color = color || '#000000';
                    productDetails.push({size, colorName, color, imgUrl, stock})
                })
            })
            const {categoryGender, categoryType, ...productInfo} = productData;
            const categoryId = category.find((category) => category.type === categoryType.value && category.gender === categoryGender.value)?.id || '';
            const sendData = {name: productInfo.name, description: productInfo.description, price: productInfo.price, categoryId: categoryId, productDetails: productDetails, discount: productInfo.discount || 0}
            const {data} = await productApi.createProduct(sendData);
            if (data) {
                handleToggle();
                toggleProductChange();
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
            <Toast ref={toast} />
            <div className='text-black-light text-2xl font-bold leading-tight text-left'>Thông tin sản phẩm</div>
            <div className="flex flex-row gap-5">
                <div className="relative">
                    <PrimeBtn text onClick={toggleFilter}>
                        {icons.filter}
                    </PrimeBtn>
                    {showFilter && (
                        <>
                            <div className='fixed inset-0 z-0' onClick={toggleFilter}></div>
                            <div className="absolute right-0 mt-3 p-1 w-[150px] bg-white border border-gray-200 rounded-md shadow-lg z-10" onClick={(e) => e.stopPropagation()}>
                                <div className="absolute top-[-6px] right-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white"></div>
                                {filterOptions.map((option) => (
                                    <PrimeBtn text key={option.label} className='flex w-full transition text-sm text-black'
                                    onClick={() => {
                                        setFilter(option.value);
                                        toggleFilter();
                                    }}
                                    >{option.label}</PrimeBtn>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <IconField iconPosition="left">
                    <InputIcon>
                        {icons.searchProduct}
                    </InputIcon>
                    <Input name="search" placeholder="Search" className="rounded-lg w-[270px]" onChange={(e) => setQuery(e.target.value)}/>
                </IconField>
                <Button className="rounded-lg" onClick={toggleAddProduct}>
                    {icons.addProduct}
                </Button>
                {addProduct && (
                <div className="fixed inset-0 h-full bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50" onClick={handleToggle}>
                    <div className="relative bg-white rounded-lg shadow-lg p-6 h-fit max-h-screen w-[70%]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-row text-xl font-bold mb-4 justify-between">
                            <p className="flex justify-center items-center text-2xl">Thêm sản phẩm</p>
                            <PrimeBtn text onClick={handleToggle} className="absolute right-0 top-2">
                                {icons.closePopup}
                            </PrimeBtn>
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
                                                        style={{ height: '375px', width: '100%' }}
                                                    />
                                                )}
                                            />
                                            {errors.description && (
                                                <span className="text-red-500">{errors.description.message}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-[30%] h-fit flex flex-col gap-4">
                                        <div className="h-fit w-full flex flex-col">
                                            <Controller
                                                name="categoryType"
                                                control={control}
                                                render={({ field }) => (
                                                    <Dropdown 
                                                    value={field.value?.value || ''} 
                                                    onChange={(val) => field.onChange({ value: val.target.value })} 
                                                    options={categoryType} optionLabel="name" 
                                                    placeholder="Chọn loại sản phẩm" 
                                                    className="w-full md:w-14rem" 
                                                    />
                                                  )}
                                            />
                                            {errors.categoryType?.value && (
                                                <span className="text-red-500">{errors.categoryType.value.message}</span>
                                            )}
                                        </div>
                                        <div className="h-fit w-full flex flex-col">
                                            <Controller
                                                name="categoryGender"
                                                control={control}
                                                render={({ field }) => (
                                                    <Dropdown 
                                                    value={field.value?.value || ''} 
                                                    onChange={(val) => field.onChange({ value: val.target.value })} 
                                                    options={categoryGender} optionLabel="name" 
                                                    placeholder="Chọn giới tính" 
                                                    className="w-full md:w-14rem" 
                                                    />
                                                  )}
                                            />
                                            {errors.categoryGender?.value && (
                                                <span className="text-red-500">{errors.categoryGender.value.message}</span>
                                            )}
                                        </div>
                                        <div className={`flex flex-col gap-4 border border-gray-200 rounded-md p-3 ${errors.sizes ? "border-red-500":''}`}>
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
                                            {errors.sizes && <span className="text-red-500">{errors.sizes.message}</span>}
                                        </div>
                                        <div className="flex flex-col gap-2 p-2 w-full">
                                            <label className="font-semibold text-xl">Số lượng màu sản phẩm</label>
                                            <Input control={control} errors={errors} type="text" name="numberOfColor" placeholder="Số màu" className="w-full rounded-lg"/>
                                            {addProduct && <div className={`${Number(watch('numberOfColor')) > 2 ? 'overflow-y-scroll h-[150px]' : ''}`}>
                                                {Array.from({ length: Number(watch('numberOfColor')) }).map((_, index) => (
                                                    <div key={index} className="flex flex-row w-full justify-between">
                                                        <label className="font-semibold flex flex-col items-center">
                                                            <p>Màu sắc {index + 1}</p>
                                                            <Controller
                                                                name={`colors.${index}`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <ColorPicker {...field} 
                                                                    format="hex" 
                                                                    value={field.value ? field.value : '000000'} 
                                                                    onChange={(e) => {
                                                                        const newColors = [...watch('colors')];
                                                                        const colorCode = '#' + e.target.value as string;
                                                                        newColors[index] = colorCode;
                                                                        setValue('colors', newColors);
                                                                    }} />
                                                                )}
                                                            />
                                                        </label>
                                                        <label className="font-semibold">
                                                            <p>Tên màu sắc {index + 1}</p>
                                                            <Input name={`colorNames.${index}`} control={control} errors={errors}/>
                                                            {errors.colorNames?.[index] && !watch(`colorNames.${index}`) && (
                                                                <span className="text-red-500">{errors.colorNames[index].message}</span>
                                                            )}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>}
                                            {colorErrorMessage && (<div className="text-red-500">{colorErrorMessage}</div>)}
                                        </div>
                                    </div>
                                </div> 
                                <div className={`${Number(watch('numberOfColor')) >= 1 && watch('sizes').length !==0 
                                    ? 'overflow-y-scroll h-fit max-h-[250px]' : ''}`}>
                                {watch('colors').map((_,colorIndex) => (
                                        <div key={colorIndex} className="mb-4">
                                            {watch('sizes').map((size, sizeIndex) => {
                                                const index = sizeIndex * watch('colors').length + colorIndex;
                                                return (
                                                    <div key={index} className="flex flex-row gap-32 justify-center items-center mb-5">
                                                    <div className="flex flex-row min-w-[400px] font-semibold text-xl text-black text-left justify-between">
                                                        <p className="w-[50%]">{`Màu ${watch('colorNames')[colorIndex] ? watch('colorNames')[colorIndex] : `${colorIndex+1}`}`}</p>
                                                        <p className="mr-3">-</p>
                                                        <p className="w-[60%] text-right">{`Kích thước ${size}`}</p>
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
                                                        {watch('imgUrls').length === 0 || errors.imgUrls?.[index] && <span className="text-red-500">{errors.imgUrls.message}</span>}
                                                        <div className="w-[85px] h-[85px] relative group">
                                                            {watch(`imgUrls.${index}`) && (
                                                                <div className="relative">
                                                                    <a href={watch(`imgUrls.${index}`)} target="_blank" rel="noopener noreferrer">
                                                                        <img src={watch(`imgUrls.${index}`)} alt={`Product ${index}`} className="w-[85px] h-[85px] object-cover mt-2" />
                                                                    </a>
                                                                    <button
                                                                        type="button"
                                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                                                        {errors.stocks?.[index] && <span className="text-red-500">{errors.stocks[index].message}</span>}
                                                    </div>
                                                </div>
                                                )
                                            })} 
                                        </div>
                                    ))}
                                </div>
                                {errorMessage && <span className='text-red-500 mb-2 text-lg'>{errorMessage}</span>}
                            </div>
                            <div className="flex flex-row w-[50%] ml-auto gap-5 justify-end items-center">
                                <Button onClick={handleToggle} className="w-[27%] bg-gray-500 border-gray-500 text-white rounded-lg py-2 hover:bg-gray-800 transition text-xl">
                                    Hủy bỏ
                                </Button>
                                <Button 
                                htmlType="submit" 
                                disabled={loading} loading={loading}
                                className="w-[27%] bg-primary border-primary text-white rounded-lg py-2 hover:bg-primary-dark transition text-xl">
                                    Tạo sản phẩm
                                </Button>
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