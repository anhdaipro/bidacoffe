export interface Table {
  id: number;
  tableNumber: number;
  status: number;
  hourlyRate:number;
}
export interface BilliardTableForm {
  id?: number;
  tableNumber: number;
  status: number;
  type: number;
  hourlyRate: number;
}
export interface BilliardTableFormSearch {
  tableNumber: string;
  status: string;
  type: string;
}