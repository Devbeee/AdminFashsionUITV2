import { IBlogForm, IGetBlogsParams } from "@/interfaces";
import { instance as axiosClient } from "@/configs";

export const blogApi = {
    create: async (blog: IBlogForm) => {
        return axiosClient.post('/blogs/create', blog);
    },
    getAll: async (params : IGetBlogsParams) => {
        const { page, limit, sortStyle, authors, searchKeyWord, createDateRange } = params;
        const authorParams = authors.map(author => `authors=${author}`).join('&');
        const createDateRangeParams = createDateRange.map(date => `createDateRange=${date.toISOString()}`).join('&');
        const url = `/blogs?keyword=${searchKeyWord}&sortStyle=${sortStyle}&page=${page}&limit=${limit}&${authorParams}&${createDateRangeParams}`;
        return axiosClient.get(url);
    },
    getAuthors: async () => {
        return axiosClient.get('/blogs/authors');
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