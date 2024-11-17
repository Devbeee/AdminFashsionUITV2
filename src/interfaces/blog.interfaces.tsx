export interface IAuthor {
    id: string;
    fullName: string;
}

export interface IBlog {
    id: string;
    title: string;
    description: string;
    slug: string;
    coverImage: string;
    author: IAuthor;
    createdAt: string;
}

export interface IBlogForm {
    title: string;
    description: string;
    coverImage: string;
}

export interface ISortStyle { 
    name: string, 
    code: string 
};

export interface IGetBlogsParams {
    page: number, 
    limit: number, 
    sortStyle: string, 
    authors: string[], 
    searchKeyWord: string | undefined, 
    createDateRange: Date[]
}