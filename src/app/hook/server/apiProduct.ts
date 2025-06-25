import { ProductFormSearch } from "@/app/type/model/Product";
import axiosServer from "../axiosServer";
const fetchProducts = async (page:number, limit:number, data:ProductFormSearch) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(data && Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value)])))
    });
    const response = await axiosServer.get(`/products?${params}`);
     console.log("🛜 fetchProducts", {
  gọiTừ: typeof window === 'undefined' ? 'server' : 'client',
});
    return response.data;
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
const fetchProduct = async (id:number) => {
  try {
    const { data } = await axiosServer.get(`/products/view/${id}`);
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
export {fetchProducts,fetchProduct}