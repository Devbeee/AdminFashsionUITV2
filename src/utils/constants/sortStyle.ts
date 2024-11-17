import { ISortStyle } from "@/interfaces";

export const sortStyle: ISortStyle[] = [
    { name: 'Mặc định', code: 'default' },
    { name: 'A -> Z', code: 'name_asc' },
    { name: 'Z -> A', code: 'name_desc' },
    { name: 'Mới nhất', code: 'date_desc' },
    { name: 'Cũ nhất', code: 'date_asc' }
];