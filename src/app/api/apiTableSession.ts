
import axiosInstance from "../hook/axiosInstance";
import { FinishSession, OrderDetailForm, TableSession, TableSessionForm, TableSessionFormSearch } from "../type/model/TableSession";
const fetchTableSessions = async (page:number, limit:number, data: TableSessionFormSearch) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(data && Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value)])))
  });
  const response = await axiosInstance.get(`/tablesession?${params}`);
  return response.data;
};
const fetchOrderTableSession = async ({id, payload}:{id:number, payload:OrderDetailForm[]}) => {
  const { data } = await axiosInstance.post(`/tablesession/order/${id}`, {orders:payload});
  return data.data;
};
const fetchTableSession = async (id:number) => {
    const { data } = await axiosInstance.get(`/tablesession/view/${id}`);
    return data.data;
  };
const createTableSession = async (payload: TableSessionForm) => {
    const { data } = await axiosInstance.post('/tablesession/create', payload);
    return data.data;
  };

const startTableSession = async (dataSession: {tableId:number}) => {
  const { data } = await axiosInstance.post('/tablesession/start', dataSession);
  return data.data;
};
const updateTableSession = async ({ id, payload }: { id: number, payload: TableSessionForm }) => {
const { data } = await axiosInstance.post(`/tablesession/update/${id}`, payload);
return data.data;
};
const deleteTableSession = async (id:number) =>{
    const { data } = await axiosInstance.post(`/tablesession/delete/${id}`);
    return data.data;
}
const fetchTableSessionPlaying = async () =>{
  const { data } = await axiosInstance.post(`/tablesession/playing`);
  return data.data;
}
const fetchTableSessionFinish = async ({id,payload}:{id:number,payload:FinishSession}) =>{
  const { data } = await axiosInstance.post(`/tablesession/finish/${id}`, payload);
  return data.data;
}
const fetchRewardTableSession = async ({id,phone}:{id:number,phone:string}) =>{
  const { data } = await axiosInstance.post(`/tablesession/reward/${id}`, {phone});
  return data.data;
}
export {
  fetchTableSessions, 
  fetchTableSession, 
  createTableSession, 
  deleteTableSession,
  fetchTableSessionPlaying,
  fetchOrderTableSession,
  updateTableSession,
  fetchTableSessionFinish,
  startTableSession,
  fetchRewardTableSession
}