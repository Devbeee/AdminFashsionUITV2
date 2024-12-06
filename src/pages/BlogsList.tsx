import { useEffect, useRef, useState } from 'react';

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { BlogCard, Button, Search } from '@/components';
import { IBlog, ISortStyle, IAuthor, IGetBlogsParams } from '@/interfaces';
import { blogApi } from "@/apis";
import { useApi } from "@/hooks";
import { icons, sortStyle } from '@/utils';

type FormData = {
    searchValue?: string
}

export function BlogsList() {
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [first, setFirst] = useState<number>(0);
    const [limit, setLimit] = useState<number>(9);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [choosedBlogs, setChoosedBlogs] = useState<string[]>([]);
    const [createDateRange, setCreateDateRange] = useState<Nullable<(Date | null)[]>>(null);
    const [allAuthors, setAllAuthors] = useState<IAuthor[]>([]);
    const [choosedAuthors, setChoosedAuthors] = useState<string[]>([]);
    const [selectedSortStyle, setSelectedSortStyle] = useState<ISortStyle>(sortStyle[0]);
    const toast = useRef<Toast>(null);
    const { errorMessage: deleteErrorMessage, callApi: callDeleteApi } = useApi<void>()
    const { callApi: callGetBlogsApi } = useApi<void>();

    const defaultValues: FormData = {
        searchValue: ''
    }

    const schema = yup.object().shape({
        searchValue: yup.string().trim()
    })

    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues,
    } = useForm({ defaultValues, resolver: yupResolver(schema) })

    const onSubmit = () => {
        getBlogs(1, limit);
        setFirst(0);
    }

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
                        getAuthors();
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

    const confirmDelete = () => {
        confirmDialog({
            message: 'Bạn có chắc muốn xóa những blog này?',
            header: 'Xóa blog',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: acceptDelete,
        });
    };

    const onChoosedBlogsChange = (event: CheckboxChangeEvent) => {
        const choosedBlogsTemp = [...choosedBlogs];
        if (event.checked) {
            choosedBlogsTemp.push(event.value);
        }
        else {
            choosedBlogsTemp.splice(choosedBlogsTemp.indexOf(event.value), 1);
        }
        setChoosedBlogs(choosedBlogsTemp);
    }

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
        getBlogs(event.page + 1, limit);
    };

    const getBlogs = async (page : number, limit : number) => {
        try {
            const params: IGetBlogsParams = {
                page: page,
                limit: limit,
                sortStyle: selectedSortStyle.code,
                authors: choosedAuthors,
                searchKeyWord: getValues('searchValue'),
                createDateRange: createDateRange && createDateRange.length > 0
                    ? [
                        createDateRange[0] || new Date(), 
                        createDateRange[1] || new Date()
                    ]
                    : []
            }
            callGetBlogsApi(async () => {
                const response = await blogApi.getAll(params);
                setBlogs(response.data.data);
                setTotalRecords(response.data.total);
            });
        } catch (error) {
            setBlogs([]);
            setTotalRecords(0);
            console.error('Failed to fetch blogs: ', error);
        }
    }

    const getAuthors = async () => {
        try {
            callGetBlogsApi(async () => {
                const response = await blogApi.getAuthors();
                setAllAuthors(response.data);
            });
        }
        catch (error) {
            console.error('Failed to fetch authors: ', error);
        }
    }

    const onChoosedAuthorsChange = (event: CheckboxChangeEvent) => {
        const choosedAuthorsTemp = [...choosedAuthors];
        if (event.checked) {
            choosedAuthorsTemp.push(event.value);
        }
        else {
            choosedAuthorsTemp.splice(choosedAuthorsTemp.indexOf(event.value), 1);
        }
        setChoosedAuthors(choosedAuthorsTemp);
    }

    const clearDateRange = () => {
        setCreateDateRange(null);
    };

    useEffect(() => {
        getBlogs(1, limit);
        setFirst(0);
    }, [choosedAuthors, selectedSortStyle, createDateRange, limit]);

    useEffect(() => {
        getAuthors();
    }, []);

    useEffect(() => {
      const handleResize = () => window.innerWidth < 1536 ? setLimit(8) : setLimit(9);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className='rounded-xl m-7 p-7 border text-left bg-white flex flex-col lg:flex-row gap-8'>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className='flex-[1] flex flex-col gap-8'>
                <div className='w-full h-20 p-4 bg-gray-100 text-gray-500 rounded border'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Search
                            className='border-partial-primary-500 w-full'
                            control={control}
                            errors={errors}
                            size='small'
                            placeholder='Tìm kiếm blog'
                        />
                    </form>
                </div>
                <div className='flex flex-col gap-8 sm:flex-row lg:flex-col'>
                <div className='w-full p-4 bg-gray-100 text-gray-500 rounded border'>
                    <div className="flex flex-col justify-center gap-2">
                        <span className='font-bold uppercase'>Ngày tạo blog</span>
                        <div className='flex justify-center items-center gap-1'>
                            <Calendar
                                value={createDateRange}
                                onChange={(event) => setCreateDateRange(event.value)}
                                selectionMode="range"
                                readOnlyInput
                                hideOnRangeSelection
                                maxDate={new Date()}
                                placeholder='Chọn khoảng thời gian' 
                            />
                            <span onClick={clearDateRange} className='text-3xl rounded-full text-gray-500 hover:bg-white m-0 p-0'>{icons.close}</span>
                        </div>
                    </div>
                </div>
                <div className='w-full p-4 bg-gray-100 text-gray-500 rounded border'>
                    <div className="flex flex-col justify-center items-start gap-2">
                        <span className='font-bold uppercase'>Tác giả</span>
                        {allAuthors.map((author) => (
                            <div key={author.id} className='flex items-center gap-2'>
                                <Checkbox
                                    inputId={author.id}
                                    name={author.fullName}
                                    value={author.id}
                                    onChange={onChoosedAuthorsChange}
                                    checked={choosedAuthors.includes(author.id)}
                                />
                                <label htmlFor={author.id} className="cursor-pointer">
                                    {author.fullName}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                </div>
            </div>
            <div className='flex-[4]'>
                <div className='h-20 bg-gray-100 py-4 px-2 border-t-2 border-b-2 flex justify-between items-center'>
                    <span className='font-bold text-3xl text-gray-700'>Blogs</span>
                    {choosedBlogs.length > 0 && (<Button onClick={confirmDelete} className='font-bold w-32 border-red-500 bg-red-500 hover:bg-red-600'>Xóa đã chọn</Button>)}
                </div>
                {blogs.length === 0 ? (
                    <div className='flex flex-col items-center justify-center bg-gray-50 m-7 p-4'>
                        <span className="text-2xl font-bold text-gray-500">Không tìm thấy blog</span>
                    </div>
                ) : (
                    <>
                        <div className='flex flex-col justify-center flex-wrap items-center mt-7 gap-4'>
                            <div className="w-full flex justify-end items-center gap-1">
                                <span className="text-gray-500 flex items-center gap-1">{icons.sort}Sắp xếp:</span>
                                <Dropdown
                                    value={selectedSortStyle}
                                    onChange={(event: DropdownChangeEvent) => setSelectedSortStyle(event.value)}
                                    options={sortStyle}
                                    optionLabel="name"
                                    className="w-36 text-gray-500 text-[0.75rem] leading-[0.1rem] border-none bg-gray-50 rounded-none"
                                />
                            </div>
                            <div className='text-center grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 2xl:gap-10'>
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
                    </>
                )}
            </div>
        </div>
    )
}