export interface FormPayment{
    sessionId : number;
    totalAmount:number;
    discount:number;
    method : number;
    note:string;
    isUsePoint:boolean;
}