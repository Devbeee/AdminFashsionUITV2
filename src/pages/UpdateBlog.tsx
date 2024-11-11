import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { Panel } from 'primereact/panel';
import { FileUpload, FileUploadFile  } from 'primereact/fileupload';
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Button, Input } from "@/components";
import { uploadToCloudinary } from '@/utils/helpers';
import { IBlog, IBlogForm } from "@/interfaces";
import { blogApi } from "@/apis";
import { useBoolean, useApi } from "@/hooks";

export function UpdateBlog() {
    const toast = useRef<Toast>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const fileUploadRef = useRef<FileUpload | null>(null);
    const [blog, setBlog] = useState<IBlog | null>(null);
    const {slug} = useParams<{ slug: string }>();
    const { value: isNavigating, setTrue: startNavigating, setFalse: stopNavigating } = useBoolean(false);
    const { errorMessage: updateErrorMessage, callApi: callUpdateApi } = useApi<void>()
    const { callApi: callGetBlogApi } = useApi<void>();
    const navigate = useNavigate();

    const schema = yup.object().shape({
        title: yup.string().required("Vui lòng nhập tiêu đề!"),
        description: yup.string().required("Vui lòng nhập nội dung!"),
        coverImage: yup.string().url("Vui lòng thêm ảnh bìa!").required("Vui lòng thêm ảnh bìa!"),
    });

    const { control, setValue, handleSubmit, formState: { errors } } = useForm<IBlogForm>({
        resolver: yupResolver(schema),
    });

    const handleImageUpload = async (file: File) => {
        setUploading(true);
        const imageUrl = await uploadToCloudinary(file);
        setUploading(false);

        if (imageUrl) {
            if (fileUploadRef.current) {
                const objectURL = URL.createObjectURL(file);
                const uploadedFile: FileUploadFile = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified,
                    webkitRelativePath: file.webkitRelativePath || '',
                    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
                    slice: (start?: number, end?: number) => file.slice(start, end),
                    stream: () => file.stream(),
                    text: () => file.text(),
                    objectURL,
                };
                fileUploadRef.current.clear();
                fileUploadRef.current.setUploadedFiles([uploadedFile]);
            }
            return imageUrl;
        } else {
            console.error('Failed to upload image');
        }
    };

    const acceptCancel = () => {
        navigate(`/admin/blog/detail/${blog?.slug}`);
    };

    const rejectCancel = () => {
        toast.current?.show({ severity: 'warn', summary: 'Đã hủy', detail: 'Xác nhận tiếp tục sửa blog', life: 3000 });
    }

    const confirmCancel = () => {
        confirmDialog({
            message: 'Bạn có chắc muốn bỏ cập nhật blog này?',
            header: 'Bỏ cập nhật',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: acceptCancel,
            reject: rejectCancel
        });
    };

    const acceptPublish = async (blogData: IBlogForm) => {
        try {
            if (blog) {
                callUpdateApi(async () => {
                    const dataRes = await blogApi.update(blog.slug, blogData);
                    if (dataRes.status === 200) {
                        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Blog đã được cập nhật thành công', life: 3000 });
                        startNavigating();
                        setTimeout(() => {
                            navigate('/admin/blog/list');
                        }, 3000);
                    } else {
                        toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: `${updateErrorMessage}`, life: 3000 });
                    }
                });
            }
        }
        catch (error) {
            console.error('Failed to update blog: ', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: `${updateErrorMessage}`, life: 3000 });
        }
    };

    const rejectPublish = () => {
        toast.current?.show({ severity: 'warn', summary: 'Đã hủy', detail: 'Xác nhận tiếp tục sửa blog', life: 3000 });
    }

    const confirmPublish = (blogData: IBlogForm) => {
        confirmDialog({
            message: 'Bạn có chắc muốn cập nhật blog này?',
            header: 'Cập nhật blog',
            defaultFocus: 'accept',
            accept: () => acceptPublish(blogData),
            reject: rejectPublish
        });
    };

    const getBlog = async () => {
        if (slug) {
            callGetBlogApi(async () => {
                const res = await blogApi.getOne(slug);
                if (res.status === 200) {
                    setBlog(res.data);
                    setValue('title', res.data.title);
                    setValue('description', res.data.description);
                    setValue('coverImage', res.data.coverImage);
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
        <form onSubmit={handleSubmit(confirmPublish)} className="rounded-xl m-7 p-7 border h-max bg-white">
            <ConfirmDialog />
            <Toast ref={toast} />
            <span className="font-bold text-3xl text-gray-700">Cập nhật Blog</span>
            <div className="flex gap-4 mt-4">
                <div className="flex-[2] flex flex-col gap-4">
                    <div>
                        <Controller
                            name="coverImage"
                            control={control}
                            render={({ field }) => (
                                <FileUpload
                                    ref={fileUploadRef}
                                    name="coverImage"
                                    accept="image/*"
                                    disabled={uploading} 
                                    customUpload
                                    maxFileSize={1000000}
                                    uploadHandler={async (event) => {
                                        const imageUrl = await handleImageUpload(event.files[0]);
                                        field.onChange(imageUrl);
                                    }}
                                    emptyTemplate={
                                        <img
                                            className="w-full h-60 object-contain z-0"
                                            src={blog.coverImage}
                                            alt={blog.title}
                                        />
                                    }
                                />
                            )}
                        />
                        {errors.coverImage && (
                            <span className="text-red-500">{errors.coverImage.message}</span>
                        )}
                    </div>
                    <div>
                        <Input control={control} name='title' placeholder="Tiêu đề blog" className="w-full" />
                        {errors.title && <span className='text-red-500 mt-80'>{errors.title.message}</span>}
                    </div>
                    <div className="h-fit">
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Editor
                                    value={field.value}
                                    placeholder="Nội dung"
                                    onTextChange={(e: EditorTextChangeEvent) => field.onChange(e.htmlValue || '')}
                                    style={{ height: '350px' }}
                                />
                            )}
                        />
                        {errors.description && (
                            <span className="text-red-500">{errors.description.message}</span>
                        )}
                    </div>
                </div>
                <div className="flex-[1] flex flex-col gap-4 justify-between">
                    <Panel header="Tags">
                        <div className="flex gap-2">
                            <span className="m-0 p-1 border rounded-full bg-slate-200">
                                Quần âu
                            </span>
                            <span className="m-0 p-1 border rounded-full bg-slate-200">
                                Quần thời trang
                            </span>
                        </div>
                    </Panel>
                    <div className="flex gap-4 justify-between">
                        <Button htmlType="reset" onClick={confirmCancel} disabled={isNavigating} className="flex-1 bg-white text-red-500 border-red-500 font-bold">Loại bỏ</Button>
                        <Button htmlType="submit" disabled={uploading || isNavigating} className="flex-1 font-bold">
                            {uploading ? 'Đang tải...' : 'Cập nhật'}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
