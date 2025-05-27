import { CustomerForm,CustomerFormSearch,Customer } from "./Customer";

export interface EmployeeForm extends CustomerForm{
    email: string;
    dateOfBirth: string;
    dateLeave: string;
    dateBeginJob: string;
    position: number;
    cccdBack: File | null;
    cccdFront: File | null;
    avatar: File | null;
    bankId: number;
    bankFullName: string;
    bankNo: string;
    baseSalary:number;
}
export interface Employee extends Customer{
    position:number;
    roleId:number;
    cccdBack: string;
    cccdFront: string;
    avatar: string;
    email: string;
    dateOfBirth: string;
    dateLeave: string;
    dateBeginJob: string;
    bankId: number;
    bankFullName: string;
    bankNo: string;
    baseSalary:number;
}
export interface EmployeeFormSearch extends CustomerFormSearch{
    position:string;
    dateBeginJob:string;
    dateLeave:string;
    dateOfBirth:string;
}
