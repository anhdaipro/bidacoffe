
import axiosInstance from "../hook/axiosInstance";
import { FormPayment } from "../type/model/Payment";


const fetchPayment = async (id:number) => {
  try {
    const { data } = await axiosInstance.get(`/products/view/${id}`);
    return data.data;
  }
  catch (error:any) {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Redirecting to login");
      // Chuyển hướng người dùng đến trang đăng nhập
      //window.location.href = "/login";
    } else {
      console.error("Error fetching products:", error);
    }
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
    
};
const createPayment = async ({payload}: {payload: FormPayment}) => {
  try {
    const { data } = await axiosInstance.post('/payment/create', payload);
    return data.data;
  }
  catch (error:any) {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Redirecting to login");
      // Chuyển hướng người dùng đến trang đăng nhập
      window.location.href = "/login";
    } else {
      console.error("Error fetching products:", error);
    }
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
    
  };
const updateProduct = async ({ id, formData }: { id: number, formData: FormData }) => {
  try {
    const { data } = await axiosInstance.post(`/products/update/${id}`, formData);
    return data.data;
  }
  catch (error:any) {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Redirecting to login");
      // Chuyển hướng người dùng đến trang đăng nhập
      //window.location.href = "/login";
    } else {
      console.error("Error fetching products:", error);
    }
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};
const updateStatusProduct = async ({ id, status }: { id: number, status: number }) => {
  try {
    const { data } = await axiosInstance.post(`/products/update-status/${id}`, {status});
    return data.data;
  }
  catch (error:any) {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Redirecting to login");
      // Chuyển hướng người dùng đến trang đăng nhập
      //window.location.href = "/login";
    } else {
      console.error("Error fetching products:", error);
    }
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};
const deleteProdcut = async (id:number) =>{
  try {
    const { data } = await axiosInstance.post(`/products/delete/${id}`);
    return data.data;
  }
  catch (error:any) {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Redirecting to login");
      // Chuyển hướng người dùng đến trang đăng nhập
      //window.location.href = "/login";
    } else {
      console.error("Error fetching products:", error);
    }
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
}
export {updateStatusProduct,createPayment, updateProduct, deleteProdcut}