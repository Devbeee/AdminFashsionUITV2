export interface IBlog {
    id: string;
    title: string;
    description: string;
    slug: string;
    coverImage: string;
    author: string;
    createdAt: string;
}

export interface IBlogForm {
    title: string;
    description: string;
    coverImage: string;
}