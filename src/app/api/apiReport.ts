import axiosInstance from "../hook/axiosInstance";
const fetchReportSummaryLast7Days = async () => {
    const response = await axiosInstance.get(`/report/revenue/week`);
    return response.data;
};
const fetchBilliardTable = async (id:number) => {
    const { data } = await axiosInstance.get(`/billiard-table/view/${id}`);
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
export {
    fetchReportSummaryLast7Days
}