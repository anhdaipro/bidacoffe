export interface TransactionDetail {
    id:number;
    quantity: number;
    price:number;
    productId: number;
    categoryId: number;
    totalPrice:number;
} 

export interface TransactionDetailForm {
    productId: number;
    categoryId: number;
    quantity: number;
    price: number;
}
export interface TransactionForm {
    id?: number;
    type: number | string;
    totalAmount: number;
    dateDelivery: string;
    details: TransactionDetailForm[];
}
export interface Transaction {
    id: number;
    type: number;
    totalAmount: number;
    dateDelivery: string;
    details: TransactionDetailForm[];
}
export interface TransactionIndex extends  Transaction{
    details: TransactionDetail[];
    rUidLogin:{name:string} | null;
    codeNo:string;
    createdAt:string;
    codeSession: string;
}
export interface TransactionFormSearch {
    status: string;
    type: string;
    codeNo: string;
    dateFrom: string;
    dateTo: string;
    uidLogin:string;
  }