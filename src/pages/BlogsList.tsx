import { useEffect, useRef, useState } from 'react';

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";

import { BlogCard, Button } from '@/components';
import { IBlog } from '@/interfaces';
import { blogApi } from "@/apis";
import { useApi } from "@/hooks";

export function BlogsList() {
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [first, setFirst] = useState<number>(0);
    const [limit, setRows] = useState<number>(8);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [choosedBlogs, setChoosedBlogs] = useState<string[]>([]);
    const toast = useRef<Toast>(null);
    const { errorMessage: deleteErrorMessage, callApi: callDeleteApi } = useApi<void>()
    const { callApi: callGetBlogsApi } = useApi<void>();

    const acceptDelete = async () => {
        try {
            if (choosedBlogs.length > 0) {
                callDeleteApi(async () => {
                    const res = await blogApi.multiDelete(choosedBlogs);
                    if (res.status === 204) {
                        toast.current?.show({ severity: 'info', summary: 'Thành công', detail: 'Đã xóa các blog được chọn', life: 3000 });
                        setChoosedBlogs([]);
                        setFirst(0);
                        getBlogs(1, limit);
                    }
                    else {
                        toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: `${deleteErrorMessage}`, life: 3000 });
                    }
                });
            }
        }
        catch (error) {
            console.error('Failed to delete blog: ', error);
            toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: `${deleteErrorMessage}`, life: 3000 });
        }
    }

    const rejectDelete = () => {
        toast.current?.show({ severity: 'warn', summary: 'Đã hủy', detail: 'Bạn đã hủy xóa blog', life: 3000 });
    }

    const confirmDelete = () => {
        confirmDialog({
            message: 'Bạn có chắc muốn xóa những blog này?',
            header: 'Xóa blog',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: acceptDelete,
            reject: rejectDelete
        });
    };

    const onChoosedBlogsChange = (e: CheckboxChangeEvent) => {
        let choosedBlogsTemp = [...choosedBlogs];
        if (e.checked){
            choosedBlogsTemp.push(e.value);
        }
        else {
            choosedBlogsTemp.splice(choosedBlogsTemp.indexOf(e.value), 1);
        }
        setChoosedBlogs(choosedBlogsTemp);
    }

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
        getBlogs(event.page + 1, limit);
    };

    const getBlogs = async (page : number, limit : number) => {
        try {
            callGetBlogsApi(async () => {
                const response = await blogApi.getAll(page, limit);
                setBlogs(response.data.data);
                setTotalRecords(response.data.total);
            });
        } catch (error) {
            console.error('Failed to fetch blogs: ', error);
        }
    }

    useEffect(()=> {
        getBlogs(1, limit);
    },[])

    if (!blogs) {
        return (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl m-7 p-7 border">
              <span className="text-2xl font-bold text-primary">Không tìm thấy blog</span>
          </div>
        );
    }

    return (
        <div className='rounded-xl m-7 p-7 border text-left bg-white'>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className='h-20 bg-gray-100 py-4 px-2 border-t-2 border-b-2 flex justify-between items-center'>
                <span className='font-bold text-3xl text-gray-700'>Blogs</span> 
                {choosedBlogs.length > 0 && (<Button onClick={confirmDelete} className='font-bold w-32 border-red-500 bg-red-500 hover:bg-red-600'>Xóa đã chọn</Button>)}
            </div>
            <div className='flex justify-center items-center mt-7'>
                <div className='text-center grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8'>
                    {blogs?.map((blog) => (
                        <div key={blog.slug}>
                            <div className='w-full flex justify-end'>
                                <Checkbox 
                                    inputId={blog.slug} 
                                    value={blog.slug}
                                    onChange={onChoosedBlogsChange} 
                                    checked={choosedBlogs.includes(blog.slug)} 
                                    className='z-50 -mb-6'
                                />
                            </div>
                            <BlogCard blog={blog} />
                        </div>
                    ))}
                </div>
            </div>
            <div className='mt-4'>
                <Paginator 
                    first={first} 
                    rows={limit} 
                    totalRecords={totalRecords} 
                    onPageChange={onPageChange} 
                />
            </div>
        </div>
    )
}