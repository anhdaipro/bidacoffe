export interface Shift {
    id: number;
    name: string;
    startTime: string; // ISO 8601 format
    endTime: string; // ISO 8601 format
    status: number; // 1 for active, 0 for inactive
    description: string; // Optional description of the shift
    numEmployee: number; // Number of employees assigned to this shift
    salaryHour:number;
}
export interface ShiftForm {
    name: string;
    startTime: string; // ISO 8601 format
    endTime: string; // ISO 8601 format
    status: number; // 1 for active, 0 for inactive
    description: string; // Optional description of the shift
    numEmployee: number; // Number of employees assigned to this shift
    salaryHour:number;
}