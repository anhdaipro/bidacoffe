export interface ScheduleForm{
    shiftId: number;
    employeeId: number; // ISO 8601 format
    status: number; // 1 for active, 0 for inactive
}