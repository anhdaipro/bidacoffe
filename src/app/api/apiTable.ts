

import axiosInstance from "../hook/axiosInstance";
import { BilliardTableForm } from "../type/model/Table";
const fetchBilliardTables = async () => {
    const response = await axiosInstance.get(`/billiard-table`);
    return response.data;
};
const fetchBilliardTable = async (id:number) => {
    const { data } = await axiosInstance.get(`/billiard-table/view/${id}`);
    return data.data;
  };
const createBilliardTable = async (dataBilliard: BilliardTableForm) => {
    const { data } = await axiosInstance.post('/billiard-table/create', dataBilliard);
    return data.data;
  };
const updateBilliardTable = async ({ id, payload }: { id: number, payload: BilliardTableForm }) => {
const { data } = await axiosInstance.post(`/billiard-table/update/${id}`, payload);
return data.data;
};
const deleteBilliardTable = async (id:number) =>{
    const { data } = await axiosInstance.post(`/billiard-table/delete/${id}`);
    return data.data;
}
const fetchBilliardTableActive = async () =>{
  const { data } = await axiosInstance.get(`/billiard-table/active`);
  return data.data;
}
export {fetchBilliardTables, fetchBilliardTable, createBilliardTable, updateBilliardTable, deleteBilliardTable, fetchBilliardTableActive}