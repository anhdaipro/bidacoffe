import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import {fetchProducts, fetchProduct, createProduct, updateProduct, deleteProdcut, fetchProductsSearch, updateStatusProduct} from '../api/apiProduct'
import { FormSearch } from '../conponent/product/Index';
export const useProducts = (page: number, limit: number, formData:FormSearch ) => {
  return useQuery({
    queryKey:['products',page, limit,formData],
    queryFn: async () =>{
        return await fetchProducts(page,limit,formData)
    },
    staleTime:1000,
    })
};
export const useProductsSearch = () => {
  return useQuery({
    queryKey:['products-search'],
    queryFn: fetchProductsSearch,
    staleTime:1000*60,
  })
};
export const useProduct = (id:number) => {
    return useQuery({
        queryKey:['product', id],
        queryFn: async () => {
            return await fetchProduct(id)
        },
        staleTime:1000*60*60,
    })
  };

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:createProduct,
        onSuccess: (data, variables, context) => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error, variables, context) => {
        // I will fire first
        },
      });
};
export const useUpdateStatusProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStatusProduct, // Hàm API để thực hiện update
    onSuccess: async (data,variables) => {
      // Sau khi thành công, invalid cache cho 'products' để fetch lại dữ liệu
      // 2. Cập nhật cache ngay lập tức cho sản phẩm cụ thể
      // queryClient.setQueryData(['product', variables.id], data);
      // await queryClient.cancelQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {

    },
  });
};
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: updateProduct, // Hàm API để thực hiện update
      onSuccess: (data,variables) => {
        // Sau khi thành công, invalid cache cho 'products' để fetch lại dữ liệu
        // 2. Cập nhật cache ngay lập tức cho sản phẩm cụ thể
        // queryClient.setQueryData(['product', variables.id], data);
        queryClient.invalidateQueries({ queryKey: ['products'] });
      },
      onError: (error: any) => {

      },
    });
  };

  export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn:deleteProdcut,
      // Tùy chọn: Optimistic updates
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ['products'] });
        const previousData = queryClient.getQueryData(['products']);
        // queryClient.setQueryData(['products'], (old: any) =>
        //   old ? old.filter((item: any) => item.id !== id) : []
        // );
        return { previousData };
      },
      onSuccess: (_, id) => {
        // Nếu cần thêm toast thành công, có thể thêm tại đây
        queryClient.invalidateQueries({ queryKey: ['products'] });
      },
      onError: (err, _, context) => {
        // Rollback nếu mutation lỗi
        if (context?.previousData) {
          queryClient.setQueryData(['products'], context.previousData);
        }
      },
      // onSettled: () => {
      //   // Re-fetch lại dữ liệu từ server để đảm bảo đồng bộ
      //   queryClient.invalidateQueries({ queryKey: ['products'] });
      // },
    });
  };
