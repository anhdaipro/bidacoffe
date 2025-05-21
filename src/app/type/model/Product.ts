export interface ProductIndex extends Product{
    canUpdate:boolean;
    canDelete:boolean;
}

export interface Product{
    id: number;
    name:string;
    price:number;
    status:number;
    image:string;
    categoryId:number;
}