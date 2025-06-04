export interface ProductIndex extends Product{
    canUpdate:boolean;
    canDelete:boolean;
    createdAt: string;
    rUidLogin: { name: string };
}
export interface Product{
    id: number;
    name:string;
    price:number;
    status:number;
    image:string;
    public_image: string|null;
    categoryId:number;
}
export interface ProductForm{
    name: string;
    price: number;
    categoryId: number;
    status: number;
    image: string | null;
    public_image: string|null
}
export interface ProductFormSearch {
    status: string;
    categoryId: string;
    name: string;
    dateFrom: string;
    dateTo: string;
    uidLogin:string;
}