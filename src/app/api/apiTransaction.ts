
import { FormInputs } from "../conponent/transaction/FormTransaction";
import { FormSearch } from "../conponent/transaction/Search";
import axiosInstance from "../hook/axiosInstance";

const fetchTransactions = async (page:number, limit:number, data: FormSearch) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(data && Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value)])))
  });
    const response = await axiosInstance.get(`/product-transactions?${params}`);
    return response.data;
};
const fetchTransaction = async (id:number) => {
    const { data } = await axiosInstance.get(`/product-transactions/view/${id}`);
    return data.data;
  };
const createTransaction = async (dataTransaction: FormInputs) => {
    const { data } = await axiosInstance.post('/product-transactions/create', dataTransaction);
    return data.data;
  };
const updateTransaction= async ({ id, payload }: { id: number, payload: FormInputs }) => {
  console.log(payload)
const { data } = await axiosInstance.post(`/product-transactions/update/${id}`, payload);
return data.data;
};
const deleteTransaction = async (id:number) =>{
    const { data } = await axiosInstance.post(`/product-transactions/delete/${id}`);
    return data.data;
}
export {fetchTransactions, fetchTransaction, createTransaction, updateTransaction, deleteTransaction}