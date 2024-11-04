import { useEffect, useRef, useState } from 'react';

import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button as Btn } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

import { CategoryPopup, Button } from '@/components';
import { ICategory } from '@/interfaces';
import { icons } from '@/utils';
import { useApi, useBoolean } from '@/hooks';
import { manageCategoryApi } from '@/apis';

export function ManageCategory() {
    const toast = useRef<Toast>(null);
    const { loading, errorMessage, callApi: callApiManageCategory } = useApi<void>()
    const [categories, setCategories] = useState<ICategory[]>([])
    const { value: isModalVisible, setTrue: showModal, setFalse: hideModal } = useBoolean(false);
    const { value: isCategoryChange, toggle: toggleCategoryChange } = useBoolean(false);
    const [selectedCategories, setSelectedCategories] = useState<ICategory[] | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

    const showUpdateModal = (category: ICategory) => {
        setSelectedCategory(category);
        showModal();
    }

    const removeCategory = async (id: string) => {
        setCategories(prevData => prevData.filter(item => item.id !== id))
        callApiManageCategory(async () => {
            const { data } = await manageCategoryApi.delete(id)
            if (data) {
                toggleCategoryChange()
                toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
            } else {
                toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: `${errorMessage}`, life: 3000 });
            }

        })
    }

    const removeMultipleCaregories = async () => {
        const ids = selectedCategories?.map(category => category.id) || [];
        if (ids.length)
            callApiManageCategory(async () => {
                try {
                    const { data } = await manageCategoryApi.removeMultiple(ids)
                    if (data) {
                        toggleCategoryChange()
                        setSelectedCategories(null)
                        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
                    } else {
                        toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: `${errorMessage}`, life: 3000 });
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

    const confirmRemove = (id: string) => {
        confirmDialog({
            message: 'Bạn có muốn xóa danh mục này?',
            header: 'Xác nhận xóa?',
            icon: icons.danger,
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: () => removeCategory(id),
        });
    };

    const confirmRemoveMultiple = () => {
        confirmDialog({
            message: 'Bạn có muốn xóa những danh mục này?',
            header: 'Xác nhận xóa?',
            icon: icons.danger,
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: () => removeMultipleCaregories(),
        });
    };

    const getAllCategories = async () => {
        callApiManageCategory(async () => {
            const { data } = await manageCategoryApi.findAll()
            setCategories(data)
        })
    }
    useEffect(() => {
        getAllCategories()
    }, [isCategoryChange])

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
            <ConfirmDialog />
            <CategoryPopup
                visible={isModalVisible}
                setHide={hideModal}
                toggleCategoryChange={toggleCategoryChange}
                category={selectedCategory}
                resetUpdateCategoryValue={selectedCategory ? () => setSelectedCategory(null) : undefined}
            />
            <Card className='m-3'>
                <DataTable
                    value={categories}
                    className='min-w-80'
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    selection={selectedCategories}
                    onSelectionChange={(e: any) => setSelectedCategories(e.value)}
                    dataKey='id'
                    header={
                        <div className='flex justify-between items-center'>
                            <div className='uppercase'>
                                Danh mục sản phẩm
                            </div>
                            <div className='flex gap-3'>
                                <Button
                                    children={
                                        <div className='flex items-center gap-2'>
                                            {icons.add}
                                            <span>Thêm danh mục</span>
                                        </div>
                                    }
                                    onClick={showModal}
                                />
                                <Button
                                    type='danger'
                                    children={
                                        <div className='flex items-center gap-2'>
                                            {icons.delete}
                                            <span>Xóa các mục đã chọn</span>
                                        </div>
                                    }
                                    disabled={!!!selectedCategories || !!!selectedCategories.length}
                                    onClick={confirmRemoveMultiple}
                                />
                            </div>
                        </div>
                    }
                >
                    <Column selectionMode='multiple' headerStyle={{ width: '7%' }}></Column>
                    <Column field='gender' header='Giới tính' bodyClassName={'capitalize'} headerStyle={{ width: '31%' }}></Column>
                    <Column field='type' header='Loại' bodyClassName={'capitalize'} headerStyle={{ width: '31%' }}></Column>
                    <Column
                        header='Hành động'
                        headerStyle={{ width: '31%' }}
                        body={(rowData) => (
                            <>
                                <Btn
                                    icon={icons.update}
                                    severity='success'
                                    rounded
                                    text
                                    raised
                                    disabled={loading}
                                    loading={loading}
                                    onClick={() => showUpdateModal(rowData)}
                                />
                                <Btn
                                    icon={icons.delete}
                                    severity='danger'
                                    rounded
                                    text
                                    raised
                                    disabled={loading}
                                    loading={loading}
                                    onClick={() => confirmRemove(rowData.id)}
                                />
                            </>
                        )}
                    />
                </DataTable>
            </Card>
        </>
    )
}