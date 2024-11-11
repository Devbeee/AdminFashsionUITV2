import { IBlogForm } from "@/interfaces";
import { instance as axiosClient } from "@/configs";

export const blogApi = {
    create: async (blog: IBlogForm) => {
        return axiosClient.post('/blogs/create', blog);
    },
    getAll: async (page : number, limit : number) => {
        return axiosClient.get(`/blogs?page=${page}&limit=${limit}`);
    },
    getOne: async (slug : string) => {
        return axiosClient.get(`/blogs/${slug}`);
    },
    update: async (slug : string, blog: IBlogForm) => {
        return axiosClient.patch(`/blogs/update/${slug}`, blog);
    },
    delete: async (slug : string) => {
        return axiosClient.delete(`/blogs/delete/${slug}`);
    },
    multiDelete: async (slugsList : string[]) => {
        return axiosClient.delete('/blogs/delete', { data: slugsList });
    }
}