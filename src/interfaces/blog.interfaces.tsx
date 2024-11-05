export interface IBlog {
    id: string;
    title: string;
    description: string;
    slug: string;
    coverImage: string;
    user: string;
    createdAt: string;
}

export interface IBlogForm {
    title: string;
    description: string;
    coverImage: string;
}