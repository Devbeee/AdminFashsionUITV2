import { ISortStyle } from "@/interfaces";

export const sortStyle: ISortStyle[] = [
    { name: 'Mặc định', code: 'DEFAULT' },
    { name: 'A -> Z', code: 'NAME_ASC' },
    { name: 'Z -> A', code: 'NAME_DESC' },
    { name: 'Mới nhất', code: 'DATE_DESC' },
    { name: 'Cũ nhất', code: 'DATE_ASC' }
];