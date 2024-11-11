import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Avatar } from 'primereact/avatar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

import { Button } from "@/components";
import { convertStringDate } from '@/utils/helpers';
import { blogApi } from "@/apis";
import { IBlog } from "@/interfaces";
import { useBoolean, useApi } from "@/hooks";
import { icons } from "@/utils";
import user_avt from '@/assets/images/user_avt.webp';

type Comment = {
    id: string,
    user: string,
    createAt: string,
    content: string
}

const CommmentsData: Comment[] = [
    {
        id: '1',
        user: 'Ma Seo Sầu',
        createAt: '2022-04-05T12:22:12',
        content: 'Bài viết rất ý nghĩa. Cảm ơn Admin đã chia sẽ'
    },
    {
        id: '2',
        user: 'Ma Seo Sầu',
        createAt: '2022-04-05T12:22:12',
        content: 'Bài viết rất ý nghĩa. Cảm ơn Admin đã chia sẽ'
    },
    {
        id: '3',
        user: 'Ma Seo Sầu',
        createAt: '2022-04-05T12:22:12',
        content: 'Bài viết rất ý nghĩa. Cảm ơn Admin đã chia sẽ'
    },
    {
        id: '4',
        user: 'Ma Seo Sầu',
        createAt: '2022-04-05T12:22:12',
        content: 'Bài viết rất ý nghĩa. Cảm ơn Admin đã chia sẽ'
    },
];

export function BlogDetail() {
    const [blog, setBlog] = useState<IBlog | null>(null);
    const {slug} = useParams<{ slug: string }>();
    const toast = useRef<Toast>(null);
    const { value: isNavigating, setTrue: startNavigating, setFalse: stopNavigating } = useBoolean(false);
    const { errorMessage: deleteErrorMessage, callApi: callDeleteApi } = useApi<void>()
    const { callApi: callGetBlogApi } = useApi<void>();
    const navigate = useNavigate();

    const acceptDelete = async () => {
        try {
            if (blog) {
                callDeleteApi(async () => {
                    const res = await blogApi.delete(blog.slug);
                    if (res.status === 204) {
                        toast.current?.show({ severity: 'info', summary: 'Thành công', detail: 'Blog này đã bị xóa', life: 3000 });
                        startNavigating();
                        setTimeout(() => {
                            navigate('/admin/blog/list');
                        }, 3000);
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
            message: 'Bạn có chắc muốn xóa blog này?',
            header: 'Xóa blog',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: acceptDelete,
            reject: rejectDelete
        });
    };
    
    const getBlog = async () => {
        if (slug) {
            callGetBlogApi(async () => {
                const res = await blogApi.getOne(slug);
                if (res.status === 200) {
                    setBlog(res.data);
                }
            });
        }
    }
    
    useEffect(() => {
        getBlog();
    },[]);

    if (!blog) {
      return (
        <div className="flex flex-col items-center justify-center bg-white rounded-xl m-7 p-7 border">
            <span className="text-2xl font-bold text-primary">Không tìm thấy blog</span>
        </div>
      );
    }

    return (
        <div className="flex flex-col items-center justify-center bg-white rounded-xl m-7 p-7 border">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="flex flex-wrap md:flex-row gap-6 justify-between w-full px-4 mt-5 mb-5">
                <div className='flex flex-wrap w-full justify-end gap-4'>
                    <Button disabled={isNavigating} to={'/admin/blog/update/' + blog.slug} className="font-bold w-32">Cập nhật</Button>
                    <Button disabled={isNavigating} onClick={confirmDelete} className="font-bold w-32 border-red-500 bg-red-500 hover:bg-red-600">Xóa</Button>
                </div>
                {blog && (
                    <div className='w-full'>
                        <div className="w-full flex justify-between items-end text-left">
                            <span className="font-bold text-3xl text-primary">{blog.title}</span>
                        </div>
                        <div className="flex flex-row gap-4 justify-start flex-wrap">
                            <div className="flex flex-row items-center gap-1">
                                <span className="text-gray-400 text-lg">{icons.watch}</span>
                                <span className="text-gray-400">{convertStringDate(blog.createdAt)}</span>
                            </div>
                            <div className="flex flex-row items-center gap-1">
                                <span className="text-gray-400 text-sm">{icons.faUser}</span>
                                <span className="text-gray-400">{blog.author}</span>
                            </div>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: blog.description }} className="flex flex-col items-start mt-2"></div>
                        <div className="mt-8">
                            <h3 className="text-left text-lg">Bình luận ({CommmentsData.length})</h3>
                            <div className="flex flex-col gap-4 mt-2">
                                {CommmentsData.map((cmt: Comment) => (
                                    <div key={cmt.id} className='flex justify-start items-center'>
                                        <Avatar image={user_avt} className="mr-2 border border-primary p-0.5" size="large" shape="circle" />
                                        <div className='flex flex-col text-left'>
                                            <span className='font-bold text-primary'>{cmt.user}</span>
                                            <span className='text-gray-400 text-sm'>{cmt.content}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}