
export interface Table {
    id: number;
    tableNumber: number;
    status: number;
    hourlyRate:number;
}
export interface TableSession{
    id: number;
    startTime: string;
    tableId:number;
    endTime: string | null;
    status: number;
    playedMinutes: number;
    totalAmount:number;
    amountTable: number;
    amountOrder: number;
    customerId: number;
    customer:{id:number;point:number,phone:number} | null
    orders: OrderDetail[];
}
export interface SessionProps{
    tables: Table[];
    tableSessions:TableSession[]
}
export interface OrderDetail {
    id?: number;
    name: string; 
    quantity: number;
    price:number;
    productId: number;
    categoryId: number;
    totalPrice:number;
}

export interface OrderForm {
    orders: OrderDetailForm[];
  }
export interface OrderDetailForm {
    quantity: number;
    price:number;
    productId: number;
    categoryId: number;
} 
export interface TableSessionForm{
    id?: number;
    startTime: string;
    tableId:number | string;
    endTime: string;
    playerName: string; // hoặc playerId nếu liên kết User
    phone: string;//số điện thoại khách
    employeeId:number | string;
    paymentMethod:number | string;
    note:string;
    discountAmount:number;
    status: number | string;
    orders: OrderDetailForm[];
}
export interface FinishSession{
    tableId:number; 
}
export interface TableSessionIndex extends TableSession{
    rUidLogin:{name:string} | null;
    createdAt:string;
    codeNo:string;
}
export interface TableSessionFormSearch {
    status: string;
    codeNo: string;
    dateFrom: string;
    dateTo: string;
    tableId: string;
    employeeId: string;
    paymentMethod: string;
    uidLogin:string;
  }