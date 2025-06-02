import axiosInstance from "../hook/axiosInstance";
import { Employee } from "../type/model/Employee";
import { ScheduleForm, ScheduleFormMuti, ScheduleFormSearch } from "../type/model/Schedule";

// Lấy danh sách lịch làm việc
const fetchSchedules = async (payload:ScheduleFormSearch) => {
    const params = new URLSearchParams({
        ...(payload && Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, String(value)])))
    });
    const {data} = await axiosInstance.get(`/schedule?${params}`);
    return data.data;
};

// Lấy thông tin chi tiết một lịch làm việc
const fetchSchedule = async (id: number) => {
    const { data } = await axiosInstance.get(`/schedule/${id}`);
    return data.data;
};
const fetchScheduleWeekly = async (date: string) => {
    const { data } = await axiosInstance.get(`/schedule/weekly?date=${date}`);
    return data.data;
};
// Tạo nhiều lịch làm việc
const apiCreateSchedules = async (payload:ScheduleFormMuti) => {
    const response = await axiosInstance.post(`/schedule/create`, payload);
    return response.data;
};

// Cập nhật nhiều lịch làm việc
const apiCreateSchedulesShift = async (workDate:string,shiftId:number,employees: Employee[]) => {
    const response = await axiosInstance.post(`/schedule/update`, { employees,workDate,shiftId });
    return response.data;
};

// Xóa một lịch làm việc
const deleteSchedule = async (id: number) => {
    const { data } = await axiosInstance.delete(`/schedule/${id}`);
    return data.data;
};

// Check-in
const checkInSchedule = async (id: number) => {
    const { data } = await axiosInstance.post(`/schedule/${id}/checkin`);
    return data.data;
};

// Check-out
const checkOutSchedule = async (id: number) => {
    const { data } = await axiosInstance.post(`/schedule/${id}/checkout`);
    return data.data;
};

export {
    fetchSchedules,
    fetchSchedule,
    apiCreateSchedules,
    fetchScheduleWeekly,
    deleteSchedule,
    checkInSchedule,
    checkOutSchedule
};