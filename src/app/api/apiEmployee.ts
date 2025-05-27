import axios from 'axios'

import { EmployeeForm, CustomerFormSearch } from '../type/model/Employee';

const apiCreateEmployee = async ({phone, name} : EmployeeForm) => {
    const response = await axios.post('/api/employee/create', { phone, name });
    return response.data;
}

const apiUpdateEmployee = async ({id, payload} :{id:number, payload:EmployeeForm}) => {
    const response = await axios.post(`/api/employee/update/${id}`, payload );
    return response.data;
}
const apigetEmployee = async (id:number) => {
    const response = await axios.get(`/api/employee/${id}`);
    return response.data;
}
const apiGetAllEmployee = async (page:number, limit:number, data: CustomerFormSearch) =>{
    const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(data && Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value)])))
    });
    const response = await axios.get(`/api/employee?${params}`);
    return response.data;
}


export {apiCreateEmployee, apiUpdateEmployee, apigetEmployee, apiGetAllEmployee}