
import { CustomerForm, CustomerFormSearch, LoginForm } from '../type/model/Customer';
import axiosInstance from '../hook/axiosInstance';


const apiCreateShift = async ({phone, name} : CustomerForm) => {
    const response = await axiosInstance.post('/shift/create', { phone, name });
    return response.data;
}
const apiSearchShift = async (name:string) => {
    const response = await axiosInstance.get(`/shift/search?name=${name}`);
    return response.data;
}
const apiUpdateShift = async ({id, payload} :{id:number, payload:CustomerForm}) => {
    const response = await axiosInstance.post(`/shift/update/${id}`, payload );
    return response.data;
}
const apiGetAllShift = async () =>{
    const {data} = await axiosInstance.get(`/shift`);
    return data.data;
}

export {apiSearchShift,apiCreateShift,apiGetAllShift,apiUpdateShift}