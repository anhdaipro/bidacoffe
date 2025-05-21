export interface Product{
    id: number;
    name:string;
    price:number;
    status:number;
    image:string;
    categoryId:number;
    canUpdate:boolean;
    canDelete:boolean;

}