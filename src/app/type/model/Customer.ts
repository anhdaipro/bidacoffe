export interface CustomerForm{
    id?: number;
    name:string;
    phone:string;
    status:number | string;
}
export interface Customer{
    id: number;
    name:string;
    status:number;
    phone:string;
    point:number;
}
export interface CustomerFormSearch{
  status:string;
  phone:string;
  dateFrom:string;
  dateTo:string;
  uidLogin:string;
}
export interface CustomerIndex extends Customer{
    canUpdate:boolean;
    canDelete:boolean;
    createdAt: string;
}
export interface LoginForm{
    identifier:string;
    password:string;
}