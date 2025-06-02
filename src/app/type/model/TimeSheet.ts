import { Employee } from "./Employee";

export interface TimeSheetForm{
    type: number; // ISO 8601 Format
    location: string; // Location of the check-in
    shiftId: number; // ID of the shift
}
export interface ScheduleShiftForm {
    shiftId: number;
    employees: Employee[]; // Array of employees assigned to the shift
    workDate: string; // ISO 8601 format
};
export interface TimeSheetFormSearch{
    shiftId: string;
    employeeId: string; // ISO 8601 format
    status: string; // 1 for active, 0 for inactive
    dateFrom: string; // ISO 8601 Format
    dateTo: string; // ISO 8601 Format
}
export interface TimeSheet{
    id: number;
    date: string;
    shiftId: number;
    employeeId: number; // ISO 8601 format
    status: number; // 1 for active, 0 for inactive
    checkInTime:string;
    checkOutTime:string;
}
export interface TimeSheetIndex extends TimeSheet{
    id: number;
    workDate: string;
    shiftId: number;
    employeeId: number; // ISO 8601 format
    status: number; // 1 for active, 0 for inactive
    checkInTime:string;
    checkOutTime:string;
    rEmployee:{name: string, roleId: number}
    rShif:{name:string;}
    actualHours: number;
}
export interface ScheduleManage{
    workDate: string;
    shiftId: number;
    numEmployee: number; // ISO 8601 format
    status: number; // 1 for active, 0 for inactive
    aEmployeeId: number[]; // Array of employee IDs assigned to the shift
}
