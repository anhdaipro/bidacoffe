import { Employee } from "./Employee";

export interface ScheduleForm{
    shiftId: number;
    employeeId: number; // ISO 8601 format
    status: number; // 1 for active, 0 for inactive
    note: string; // Optional note for the schedule
    startTime: string; // Time in "HH:mm:ss" format
    endTime: string; // Time in "HH:mm:ss" format
    salaryHour:number;
}
export interface ScheduleInsert{
    shiftId: number;
    employeeId: number; // ISO 8601 format
    status: number; // 1 for active, 0 for inactive
    note?: string; // Optional note for the schedule
    startTime: string; // Time in "HH:mm:ss" format
    endTime: string; // Time in "HH:mm:ss" format
    workDate: string; // ISO 8601 format
}
export interface ScheduleShiftForm {
    shiftId: number;
    employees: Employee[]; // Array of employees assigned to the shift
    workDate: string; // ISO 8601 format
};
export interface ScheduleFormSearch{
    shiftId: string;
    employeeId: string; // ISO 8601 format
    status: string; // 1 for active, 0 for inactive
    dateFrom: string; // ISO 8601 Format
    dateTo: string; // ISO 8601 Format
    roleId:string;
}
export interface Schedule{
    id: number;
    workDate: string;
    shiftId: number;
    employeeId: number; // ISO 8601 format
    status: number; // 1 for active, 0 for inactive
    note: string; // Optional note for the schedule
    startTime: string; // Time in "HH:mm:ss" format
    endTime: string; // Time in "HH:mm:ss" format
    salaryHour:number;
}
export interface ScheduleManage{
    workDate: string;
    shiftId: number;
    numEmployee: number; // ISO 8601 format
    status: number; // 1 for active, 0 for inactive
    aEmployeeId: number[]; // Array of employee IDs assigned to the shift
}
export interface ScheduleFormMuti {
    records: ScheduleForm[];
    workDate: string; // ISO 8601 format
}