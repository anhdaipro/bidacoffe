
import axiosInstance from "../hook/axiosInstance";
import { ProductForm, ProductFormSearch } from "../type/model/Product";
const fetchProducts = async (page:number, limit:number, data:ProductFormSearch) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(data && Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value)])))
    });
    const response = await axiosInstance.get(`/products?${params}`);
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
const fetchProductsSearch = async () => {
  try {
    const response = await axiosInstance.get(`/products/search`);
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
const createProduct = async (productData: ProductForm) => {
  try {
    const { data } = await axiosInstance.post('/products/create', productData);
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
const updateProduct = async ({ id, payload }: { id: number, payload: ProductForm }) => {
  try {
    const { data } = await axiosInstance.post(`/products/update/${id}`, payload);
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
export {fetchProducts,updateStatusProduct, fetchProduct, createProduct, updateProduct, deleteProdcut,fetchProductsSearch}