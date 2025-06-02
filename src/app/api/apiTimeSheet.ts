import axiosInstance from "../hook/axiosInstance";
import { TimeSheetForm, TimeSheetFormSearch } from "../type/model/TimeSheet";

// Lấy danh sách lịch làm việc
const apiCheckinTimeSheet = async (payload:TimeSheetForm) => {
    const response = await axiosInstance.post(`/timesheet/checkin`, payload);
    return response.data;
};

// Lấy danh sách lịch làm việc
const apiCheckoutTimeSheet = async (payload:TimeSheetForm) => {
    const response = await axiosInstance.post(`/timesheet/checkout`, payload);
    return response.data;
}

const apiListTimeSheet = async (page:number, limit:number, payload: TimeSheetFormSearch) => {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(payload && Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, String(value)])))
    });
    const { data } = await axiosInstance.get(`/timesheet?${params}`);
    return data;
}


// Xóa một lịch làm việc
const deleteSchedule = async (id: number) => {
    const { data } = await axiosInstance.delete(`/schedule/${id}`);
    return data.data;
};

export {
    apiCheckinTimeSheet,
    apiCheckoutTimeSheet,
    deleteSchedule,
    apiListTimeSheet
};