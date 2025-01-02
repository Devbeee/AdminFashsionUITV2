import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { FileUpload, FileUploadFile  } from 'primereact/fileupload';
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Button, Input } from "@/components";
import { uploadToCloudinary } from '@/utils/helpers';
import { IBlogForm } from "@/interfaces";
import { blogApi } from "@/apis";
import { useBoolean, useApi } from "@/hooks";

export function CreateBlog() {
    const toast = useRef<Toast>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const fileUploadRef = useRef<FileUpload | null>(null);
    const { value: isNavigating, setTrue: startNavigating } = useBoolean(false);
    const { errorMessage, callApi: callCreateApi } = useApi<void>()
    const navigate = useNavigate();

    const schema = yup.object().shape({
        title: yup.string().required("Please enter the title!"),
        description: yup.string().required("Please enter the description!"),
        content: yup.string().required("Please enter the content!"),
        coverImage: yup.string().url("Please add a cover image!").required("Please add a cover image!"),
    });

    const { control, handleSubmit, formState: { errors } } = useForm<IBlogForm>({
        resolver: yupResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            content: '',
            coverImage: ''
        }
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
            console.error("Failed to upload image");
        }
    };

    const acceptCancel = () => {
        navigate('/admin/blog/list');
    };

    const confirmCancel = () => {
        confirmDialog({
            message: 'Are you sure you want to discard this blog?',
            header: 'Discard Blog',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: acceptCancel,
        });
    };

    const acceptPublish = async (data: IBlogForm) => {
        try{
            callCreateApi(async () => {
                const dataRes = await blogApi.create(data);
                if (dataRes.status === 201) {
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Blog created successfully', life: 3000 });
                    startNavigating();
                    setTimeout(() => {
                        navigate('/admin/blog/list');
                    }, 3000);
                } else {
                    toast.current?.show({ severity: 'error', summary: 'Failure', detail: `${errorMessage}`, life: 3000 });
                }
            });
        }
        catch (error) {
            console.error('Failed to create blog: ', error);
            toast.current?.show({ severity: 'error', summary: 'Failure', detail: `${errorMessage}`, life: 3000 });
        }
    };

    const confirmPublish = (data: IBlogForm) => {
        confirmDialog({
            message: 'Are you sure you want to create this blog?',
            header: 'Create Blog',
            defaultFocus: 'accept',
            accept: () => acceptPublish(data),
        });
    };

    return (
        <form onSubmit={handleSubmit(confirmPublish)} className="rounded-xl m-7 p-7 border bg-white">
            <ConfirmDialog />
            <Toast ref={toast} />
            <span className="font-bold text-3xl text-gray-700">Create Blog</span>
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
                                    emptyTemplate={<p className="m-0">Select a cover image</p>}
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
                        <Input type="text" control={control} errors={errors} name='description' placeholder="Description" size="small" className="w-full" />
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
                    <Button htmlType="reset" onClick={confirmCancel} disabled={isNavigating} className="flex-1 bg-white text-red-500 border-red-500 font-bold max-w-40">Discard</Button>
                    <Button htmlType="submit" disabled={uploading || isNavigating} className="flex-1 font-bold max-w-40">
                        {uploading ? 'Uploading...' : 'Create Blog'}
                    </Button>
                </div>
            </div>
        </form>
    );
}
