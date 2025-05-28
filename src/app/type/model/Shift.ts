export interface Shift {
    id: number;
    name: string;
    startTime: string; // ISO 8601 format
    endTime: string; // ISO 8601 format
    status: number; // 1 for active, 0 for inactive
}