import axios from 'axios'
import { UAParser } from 'ua-parser-js';
import { CustomerForm, CustomerFormSearch, LoginForm } from '../type/model/Customer';
import axiosInstance from '../hook/axiosInstance';

async function getDeviceInfo() {
    const parser = new UAParser(); // Correct instantiation as a function call
    const userAgent = parser.getResult();
    // Lấy thông tin về thiết bị và trình duyệt
    const deviceInfo = {
        browser: userAgent.browser.name,
        browserVersion: userAgent.browser.version,
        os: userAgent.os.name,
        device: userAgent.device.model || 'desktop',
    };
    return deviceInfo;
}
const apiLogin = async ({identifier, password} : LoginForm) => {
    const deviceInfo = await getDeviceInfo();
    const response = await axios.post('/api/login', { identifier, password,deviceInfo });
    return response.data;
}
const apiCreateCustomer = async ({phone, name} : CustomerForm) => {
    const response = await axiosInstance.post('/customer/create', { phone, name });
    return response.data;
}
const apiSearchCustomer = async (name:string) => {
    const response = await axiosInstance.get(`/customer/search?name=${name}`);
    return response.data;
}
const apiUpdateCustomer = async ({id, payload} :{id:number, payload:CustomerForm}) => {
    const response = await axiosInstance.post(`/customer/update/${id}`, payload );
    return response.data;
}
const apiFindCustomer = async (phone :{phone:string}) => {
    const response = await axiosInstance.post('/find-customer', { phone });
    return response.data;
}
const apigetUser = async (id:number) => {
    const response = await axiosInstance.get(`/user/${id}`);
    return response.data;
}
const apiGetAllCustomer = async (page:number, limit:number, data: CustomerFormSearch) =>{
    const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(data && Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value)])))
    });
    const response = await axiosInstance.get(`/customer?${params}`);
    return response.data;
}


export {apiSearchCustomer, apiLogin,apiCreateCustomer,apiFindCustomer,apiGetAllCustomer,apiUpdateCustomer,apigetUser}