import { useEffect, useRef } from 'react'

import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast';

import { useApi } from '@/hooks'
import { manageCategoryApi } from '@/apis'
import { ICategoryInput, ICategory } from '@/interfaces'

import { Button } from './CustomComponents/CustomButton'
import { Input } from './CustomComponents/CustomInput'

type DialogComp = {
    visible: boolean,
    setHide: () => void;
    toggleCategoryChange: () => void;
    category: ICategory | null,
    resetUpdateCategoryValue?: () => void;
}

const categorySchema = yup.object().shape({
    gender: yup.string().required('Vui lòng nhập giới tính.'),
    type: yup.string().required('Vui lòng nhập loại sản phẩm!'),
});

export const CategoryPopup: React.FC<DialogComp> = ({
    visible,
    setHide,
    toggleCategoryChange,
    category,
    resetUpdateCategoryValue
}) => {
    const toast = useRef<Toast>(null);
    const { loading, errorMessage, callApi: callApiManageCategory } = useApi<void>()
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(categorySchema),
    })

    const handleClose = () => {
        setHide();
        reset();
        if (resetUpdateCategoryValue) {
            resetUpdateCategoryValue();
        }
    }

    const handleAddCategory = (categoryData: ICategoryInput) => {
        callApiManageCategory(async () => {
            const { data } = await manageCategoryApi.create(categoryData);
            if (data) {
                reset();
                setHide();
                toggleCategoryChange();
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Thêm danh mục thành công',
                    life: 3000,
                });
            }
        })
    }

    const handleUpdateCategory = (id: string, categoryData: ICategoryInput) => {
        callApiManageCategory(async () => {
            try {
                const { data } = await manageCategoryApi.update(id, categoryData)
                if (data) {
                    reset()
                    setHide()
                    toggleCategoryChange()
                    if (resetUpdateCategoryValue) {
                        resetUpdateCategoryValue();
                    }
                    toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Sửa danh mục thành công', life: 3000 });
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

    const handleSubmitForm = (categoryData: ICategoryInput) => {
        if (category?.id) {
            handleUpdateCategory(category.id, categoryData);
        } else {
            handleAddCategory(categoryData);
        }
    };

    useEffect(() => {
        if (category) {
            setValue('gender', category.gender)
            setValue('type', category.type)
        } else {
            setValue('gender', '')
            setValue('type', '')
        }
    }, [category]);

    useEffect(() => {
        if (errorMessage)
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: `${errorMessage}`,
                life: 3000,
            });
    }, [errorMessage])
    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visible} onHide={handleClose} header={category?.id ? 'Sửa danh mục sản phẩm' : 'Thêm danh mục sản phẩm'} style={{ width: '30vw' }}>
                <form onSubmit={handleSubmit(handleSubmitForm)}>
                    <div className='p-1 mb-3'>
                        <Input
                            label='Giới tính'
                            type='text'
                            name='gender'
                            placeholder='Nhập giới tính...'
                            control={control}
                            errors={errors}
                            className='w-full'
                        />
                    </div>
                    <div className='p-1 mb-3'>
                        <Input
                            label='Loại sản phẩm'
                            type='text'
                            name='type'
                            placeholder='Nhập loại sản phẩm...'
                            control={control}
                            errors={errors}
                            className='w-full'
                        />
                    </div>
                    <div className='flex justify-end gap-3'>
                        <Button
                            children={'Hủy'}
                            htmlType='reset'
                            className='bg-transparent border-black text-black hover:opacity-65'
                            onClick={handleClose}
                        />
                        <Button
                            children={category?.id ? 'Sửa' : 'Thêm'}
                            loading={loading}
                            disabled={loading}
                            htmlType='submit'
                        />
                    </div>
                </form>
            </Dialog>
        </>
    )
}