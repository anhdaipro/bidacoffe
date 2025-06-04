import { CustomerForm,CustomerFormSearch,Customer, CustomerIndex } from "./Customer";

export interface EmployeeForm extends CustomerForm{
    email: string;
    roleId:number | string;
    dateOfBirth: string;
    dateLeave: string;
    dateBeginJob: string;
    cccdBack: File | null;
    cccdFront: File | null;
    avatar: File | null;
    bankId: number;
    bankFullname: string;
    bankNo: string;
    baseSalary:number;
    typeEducation: number;
    note: string;
    shiftId: number;
    publicAvatar: string;
    publicCccdFront: string;
    publicCccdBack: string;
}
export interface EmployeeFormSubmit extends CustomerForm{
    email: string;
    roleId:number | string;
    dateOfBirth: string;
    dateLeave: string;
    dateBeginJob: string;
    cccdBack: string;
    cccdFront: string;
    avatar: string;
    bankId: number;
    bankFullname: string;
    bankNo: string;
    baseSalary:number;
    typeEducation: number;
    note: string;
    shiftId: number;
    publicAvatar: string;
    publicCccdFront: string;
    publicCccdBack: string;
}
export interface Employee extends Customer{
    roleId:number;
    cccdBack: string;
    cccdFront: string;
    avatar: string;
    email: string;
    dateOfBirth: string;
    dateLeave: string;
    dateBeginJob: string;
    bankId: number;
    bankFullname: string;
    bankNo: string;
    baseSalary:number;
    typeEducation: number;
    note: string;
    shiftId: number;
    publicAvatar: string;
    publicCccdFront: string;
    publicCccdBack: string;
    
}
export interface EmployeeIndex extends CustomerIndex{
    roleId:number;
    cccdBack: string;
    cccdFront: string;
    avatar: string;
    email: string;
    dateOfBirth: string;
    dateLeave: string;
    dateBeginJob: string;
    bankId: number;
    bankFullname: string;
    bankNo: string;
    baseSalary:number;
    typeEducation: number;
}
export interface EmployeeFormSearch extends CustomerFormSearch{
   
}
