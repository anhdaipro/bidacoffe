import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import {fetchBilliardTables, fetchBilliardTable, createBilliardTable, updateBilliardTable, deleteBilliardTable, fetchBilliardTableActive} from '../api/apiTable'
export const useBilliardTables = () => {
  return useQuery({
    queryKey:['BilliardTables'],
    queryFn: async () =>{
        return await fetchBilliardTables()
    },
    staleTime:1000*60,
    refetchOnWindowFocus: false, // ✅ KHÔNG refetch khi quay lại tab
    })
};
export const useBilliardTable = (id:number) => {
    return useQuery({
        queryKey:['BilliardTable', id],
        queryFn: async () => {
            return await fetchBilliardTable(id)
        },
        staleTime:1000*60*60,
        refetchOnWindowFocus: false, // ✅ KHÔNG refetch khi quay lại tab
    })
  };

export const useCreateBilliardTable = () => {
    return useMutation({
        mutationFn:createBilliardTable,
        onSuccess: (data, variables, context) => {
        // I will fire first
        },
        onError: (error, variables, context) => {
        // I will fire first
        },
      });
};
export const useUpdateBilliardTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: updateBilliardTable, // Hàm API để thực hiện update
      onSuccess: (data,variables) => {
        // Sau khi thành công, invalid cache cho 'products' để fetch lại dữ liệu
        // 2. Cập nhật cache ngay lập tức cho sản phẩm cụ thể
        queryClient.setQueryData(['BilliardTable', variables.id], data);
      },
      onError: (error: any) => {

      },
    });
  };

  export const useDeleteBilliardTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn:deleteBilliardTable,
      onSuccess: (_, id) => {
        // 1. Xóa sản phẩm khỏi danh sách products
        queryClient.setQueryData(['BilliardTables'], (old: any) => 
          old.filter((product: any) => product.id !== id)
        );
        // 2. Xóa cache của sản phẩm riêng lẻ nếu có
        queryClient.removeQueries({ queryKey: ['BilliardTable', id] });
        // 3. Thông báo thành công
        alert('Product deleted successfully!');
      },
      // Tùy chọn: Optimistic updates
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ['BilliardTabless'] });
        const previousProducts = queryClient.getQueryData(['BilliardTables']);
        queryClient.setQueryData(['BilliardTables'], (old: any) => 
          old.filter((product: any) => product.id !== id)
        );
        return { previousProducts };
      },
      onSettled: () => {
        // Đảm bảo dữ liệu đồng bộ với server
        queryClient.invalidateQueries({ queryKey: ['BilliardTables'] });
      },
    });
  };
export const useBilliardTableActive = () => {
    return useQuery({
        queryKey:['BilliardTableActive'],
        queryFn: async () =>{
            const res = await fetchBilliardTableActive()
            return res
        },
        staleTime:1000*6,
        refetchOnWindowFocus: false, // ✅ KHÔNG refetch khi quay lại tab
    })
}
