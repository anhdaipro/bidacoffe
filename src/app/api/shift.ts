
import axiosInstance from '../hook/axiosInstance';
import { ShiftForm } from '../type/model/Shift';

const apiCreateShift = async (payload : ShiftForm) => {
    const response = await axiosInstance.post('/shift/create', payload);
    return response.data;
}
const apiSearchShift = async (name:string) => {
    const response = await axiosInstance.get(`/shift/search?name=${name}`);
    return response.data;
}
const apiUpdateShift = async ({id, payload} :{id:number, payload: ShiftForm}) => {
    const response = await axiosInstance.post(`/shift/update/${id}`, payload );
    return response.data;
}
const apiGetAllShift = async () =>{
    const {data} = await axiosInstance.get(`/shift`);
    return data.data;
}

export {apiSearchShift,apiCreateShift,apiGetAllShift,apiUpdateShift}