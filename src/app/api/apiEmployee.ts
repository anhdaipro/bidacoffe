
import { EmployeeForm, EmployeeFormSearch } from '../type/model/Employee';
import axiosInstance from '../hook/axiosInstance';

const apiCreateEmployee = async (formData: FormData) => {
    const response = await axiosInstance.post('/employee/create', formData);
    return response.data;
}

const apiUpdateEmployee = async ({id, formData} :{id:number, formData:FormData}) => {
    const response = await axiosInstance.post(`/employee/update/${id}`, formData );
    return response.data;
}
const apigetEmployee = async (id:number) => {
    const {data} = await axiosInstance.get(`/employee/view/${id}`);
    return data.data;
}
const apiGetAllEmployee = async (page:number, limit:number, data: EmployeeFormSearch) =>{
    const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(data && Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value)])))
    });
    const response = await axiosInstance.get(`/employee?${params}`);
    return response.data;
}
const apiGetEmployeeSchedule = async () =>{
    const {data} = await axiosInstance.get(`/employee/schedule`);
    return data.data;
}

export {apiCreateEmployee, apiUpdateEmployee, apigetEmployee, 
    apiGetAllEmployee,
    apiGetEmployeeSchedule
}