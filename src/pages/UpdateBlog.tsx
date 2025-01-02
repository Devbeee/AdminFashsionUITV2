import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { FileUpload, FileUploadFile } from 'primereact/fileupload';
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';

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
    const { slug } = useParams<{ slug: string }>();
    const { value: isNavigating, setTrue: startNavigating } = useBoolean(false);
    const { errorMessage: updateErrorMessage, callApi: callUpdateApi } = useApi<void>()
    const { errorMessage: deleteErrorMessage, callApi: callDeleteApi } = useApi<void>()
    const { callApi: callGetBlogApi } = useApi<void>();
    const navigate = useNavigate();
    const [loadingBlog, setLoadingBlog] = useState<boolean>(false);

    const schema = yup.object().shape({
        title: yup.string().required("Please enter the title!"),
        description: yup.string().required("Please enter the description!"),
        content: yup.string().required("Please enter the content!"),
        coverImage: yup.string().url("Please add a cover image!").required("Please add a cover image!"),
    });

    const { control, setValue, handleSubmit, formState: { errors, isDirty } } = useForm<IBlogForm>({
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

    const acceptPublish = async (blogData: IBlogForm) => {
        try {
            if (blog) {
                callUpdateApi(async () => {
                    const dataRes = await blogApi.update(blog.slug, blogData);
                    if (dataRes.status === 200) {
                        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'The blog has been successfully updated', life: 3000 });
                        startNavigating();
                        setTimeout(() => {
                            navigate('/admin/blog/list');
                        }, 3000);
                    } else {
                        toast.current?.show({ severity: 'error', summary: 'Failed', detail: `${updateErrorMessage}`, life: 3000 });
                    }
                });
            }
        }
        catch (error) {
            console.error('Failed to update blog: ', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: `${updateErrorMessage}`, life: 3000 });
        }
    };

    const confirmPublish = (blogData: IBlogForm) => {
        confirmDialog({
            message: 'Are you sure you want to update this blog?',
            header: 'Update Blog',
            defaultFocus: 'accept',
            accept: () => acceptPublish(blogData),
        });
    };

    const acceptDelete = async () => {
        try {
            if (blog) {
                callDeleteApi(async () => {
                    const res = await blogApi.delete(blog.slug);
                    if (res.status === 204) {
                        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'This blog has been deleted', life: 3000 });
                        startNavigating();
                        setTimeout(() => {
                            navigate('/admin/blog/list');
                        }, 3000);
                    }
                    else {
                        toast.current?.show({ severity: 'error', summary: 'Failed', detail: `${deleteErrorMessage}`, life: 3000 });
                    }
                });
            }
        }
        catch (error) {
            console.error('Failed to delete blog: ', error);
            toast.current?.show({ severity: 'error', summary: 'Failed', detail: `${deleteErrorMessage}`, life: 3000 });
        }
    }

    const confirmDelete = () => {
        confirmDialog({
            message: 'Are you sure you want to delete this blog?',
            header: 'Delete Blog',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: acceptDelete,
        });
    };

    const getBlog = async () => {
        setLoadingBlog(true);
        if (slug) {
            await callGetBlogApi(async () => {
                const res = await blogApi.getOne(slug);
                if (res.status === 200) {
                    setBlog(res.data);
                    setValue('title', res.data.title);
                    setValue('description', res.data.description);
                    setValue('content', res.data.content);
                    setValue('coverImage', res.data.coverImage);
                }
            });
        }
        setLoadingBlog(false);
    }

    useEffect(() => {
        getBlog();
    }, []);

    return (
        <form onSubmit={handleSubmit(confirmPublish)} className="rounded-xl m-7 p-7 border h-max bg-white">
            <ConfirmDialog />
            <Toast ref={toast} />
            <span className="font-bold text-3xl text-gray-700">Update Blog</span>
            {loadingBlog ? (
                <div className='flex justify-center items-center min-h-[100vh]'>
                    <ProgressSpinner />
                </div>
            ) : (
                blog ? (
                    <div className="flex flex-col gap-4 mt-4">
                        <div className="flex flex-col gap-4">
                            <div>
                                <Controller
                                    name="coverImage"
                                    control={control}
                                    render={({ field }) => (
                                        <FileUpload
                                            ref={fileUploadRef}
                                            name="coverImage"
                                            accept="image/*"
                                            disabled={uploading || isNavigating}
                                            customUpload
                                            maxFileSize={10000000}
                                            uploadHandler={async (event) => {
                                                const imageUrl = await handleImageUpload(event.files[0]);
                                                field.onChange(imageUrl);
                                            }}
                                            onRemove={() => field.onChange('')}
                                            onClear={() => field.onChange('')}
                                            onBeforeSelect={() => field.onChange('')}
                                            onBeforeDrop={() => field.onChange('')}
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
                                <Input type="text" control={control} errors={errors} name='title' placeholder="Blog title" className="w-full" />
                            </div>
                            <div>
                                <Input type="text" control={control} errors={errors} name='description' placeholder="Description" className="w-full" />
                            </div>
                            <div className="h-fit">
                                <Controller
                                    name="content"
                                    control={control}
                                    render={({ field }) => (
                                        <Editor
                                            value={field.value}
                                            placeholder="Content"
                                            onTextChange={(e: EditorTextChangeEvent) => field.onChange(e.htmlValue || '')}
                                            style={{ height: '350px' }}
                                        />
                                    )}
                                />
                                {errors.content && (
                                    <span className="text-red-500">{errors.content.message}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-4 sm:justify-end justify-between">
                            <Button htmlType="button" disabled={isNavigating} onClick={confirmDelete} className="font-bold border-red-500 bg-red-500 hover:bg-red-600 w-40">Delete</Button>
                            <Button htmlType="submit" disabled={uploading || isNavigating || !isDirty} className="flex-1 font-bold max-w-40">
                                {uploading ? 'Uploading...' : 'Update'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center bg-white rounded-xl m-7 p-7 border">
                        <span className="text-2xl font-bold text-primary">Blog not found</span>
                    </div>
                )
            )}
        </form>
    );
}
