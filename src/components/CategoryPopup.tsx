import { useEffect, useRef } from 'react'

import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { Button } from './CustomComponents/CustomButton'
import { Input } from './CustomComponents/CustomInput'

import { useApi } from '@/hooks'
import { manageCategoryApi } from '@/apis'
import { Dialog } from 'primereact/dialog'
import { ICategoryInput } from '@/interfaces'
import { Toast } from 'primereact/toast';
type DialogComp = {
    visible: boolean,
    setHide: () => void;
    toggle: () => void;
    id?: string;
    gender?: string;
    type?: string;
    resetUpdateValue?: () => void;
}

const categorySchema = yup.object().shape({
    gender: yup.string().required('Vui lòng nhập giới tính.'),
    type: yup.string().required('Vui lòng nhập loại sản phẩm!'),
});

export const CategoryPopup: React.FC<DialogComp> = ({
    visible,
    setHide,
    toggle,
    id,
    gender,
    type,
    resetUpdateValue
}) => {
    const toast = useRef<Toast>(null);
    const { loading, errorMessage, callApi: callApiManageCategory } = useApi<void>()
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(categorySchema),
        defaultValues: {
            gender: '',
            type: '',
        }
    })

    const handleClose = () => {
        setHide();
        reset();
        if (resetUpdateValue) {
            resetUpdateValue();
        }
    }

    const handleAddCategory = (categoryData: ICategoryInput) => {
        callApiManageCategory(async () => {
            const { data } = await manageCategoryApi.create(categoryData);
            if (data) {
                reset();
                setHide();
                toggle();
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Thêm thành công',
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
                    toggle()
                    if (resetUpdateValue) {
                        resetUpdateValue();
                    }
                    toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Sửa thành công', life: 3000 });
                } else {
                    toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: 'Danh mục đã tồn tại', life: 3000 });
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
        if (id) {
            handleUpdateCategory(id, categoryData);
        } else {
            handleAddCategory(categoryData);
        }
    };

    useEffect(() => {
        reset({
            gender: gender || '',
            type: type || '',
        });
    }, [gender, type, reset]);

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
            <Dialog visible={visible} onHide={handleClose} header={id ? 'Sửa danh mục sản phẩm' : 'Thêm danh mục sản phẩm'} style={{ width: '30vw' }}>
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
                            children={id ? 'Sửa' : 'Thêm'}
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