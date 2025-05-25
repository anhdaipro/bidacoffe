import { BilliardTableForm, Table } from "./model/Table";

interface DayData{
    date:string;
    revenue:number;
}
export interface TableDashboard extends Table{
    playedMinutes:number;
}
export interface DashBoard{
    weekData:DayData[]
    todayRevenue:number;
    countTable:number
    aTablePlaying:TableDashboard[]
    countInvoice:number;
}