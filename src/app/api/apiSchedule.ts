import axiosInstance from "../hook/axiosInstance";
import { ScheduleForm } from "../type/model/Schedule";

// Lấy danh sách lịch làm việc
const fetchSchedules = async () => {
    const response = await axiosInstance.get(`/schedules`);
    return response.data;
};

// Lấy thông tin chi tiết một lịch làm việc
const fetchSchedule = async (id: number) => {
    const { data } = await axiosInstance.get(`/schedules/${id}`);
    return data.data;
};

// Tạo nhiều lịch làm việc
const createSchedules = async (schedules: ScheduleForm[]) => {
    const { data } = await axiosInstance.post(`/schedules`, { schedules });
    return data.data;
};

// Cập nhật nhiều lịch làm việc
const updateSchedules = async (schedules: ScheduleForm[]) => {
    const { data } = await axiosInstance.put(`/schedules`, { schedules });
    return data.data;
};

// Xóa một lịch làm việc
const deleteSchedule = async (id: number) => {
    const { data } = await axiosInstance.delete(`/schedules/${id}`);
    return data.data;
};

// Check-in
const checkInSchedule = async (id: number) => {
    const { data } = await axiosInstance.post(`/schedules/${id}/checkin`);
    return data.data;
};

// Check-out
const checkOutSchedule = async (id: number) => {
    const { data } = await axiosInstance.post(`/schedules/${id}/checkout`);
    return data.data;
};

export {
    fetchSchedules,
    fetchSchedule,
    createSchedules,
    updateSchedules,
    deleteSchedule,
    checkInSchedule,
    checkOutSchedule
};