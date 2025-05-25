import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import {fetchTableSessions, fetchTableSession, createTableSession, updateTableSession, deleteTableSession,fetchTableSessionPlaying, fetchTableSessionFinish, fetchOrderTableSession, startTableSession, fetchRewardTableSession} from '../api/apiTableSession'
import { TableSessionFormSearch } from '../type/model/TableSession';
export const useTableSessions = (page: number, limit: number, formData:TableSessionFormSearch) => {
  return useQuery({
    queryKey:['TableSessions',page, limit, formData],
    queryFn: async () =>{
        return await fetchTableSessions(page,limit,formData)
    },
    staleTime:1000*6,
    refetchOnWindowFocus: false, // ✅ KHÔNG refetch khi quay lại tab
    })
};
export const useTableSessionsPlaying = () => {
    return useQuery({
      queryKey:['TableSessionsPlaying'],
      queryFn: async () =>{
          return await fetchTableSessionPlaying()
      },
      staleTime:1000*6,
      refetchOnWindowFocus: false, // ✅ KHÔNG refetch khi quay lại tab
      })
  };
export const useTableSession = (id:number) => {
    return useQuery({
        queryKey:['TableSession', id],
        queryFn: async () => {
            return await fetchTableSession(id)
        },
        staleTime:1000*6,
        refetchOnWindowFocus: false, // ✅ KHÔNG refetch khi quay lại tab
    })
  };
export const useFinishTableSession = () =>{
  return useMutation({
        mutationFn:fetchTableSessionFinish,
        onSuccess: (data, variables, context) => {
        // I will fire first
        },
        onError: (error, variables, context) => {
        // I will fire first
        },
      });
}
export const useOrderTableSession = () =>{
  return useMutation({
        mutationFn:fetchOrderTableSession,
        onSuccess: (data, variables, context) => {
        // I will fire first
        },
        onError: (error, variables, context) => {
        // I will fire first
        },
      });
}
export const useCreateTableSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:createTableSession,
        onSuccess: (data, variables, context) => {
        // I will fire first
        },
        onError: (error, variables, context) => {
        // I will fire first
        },
      });
};
export const useStartTableSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn:startTableSession,
      onSuccess: (data, variables, context) => {
      // I will fire first
      },
      onError: (error, variables, context) => {
      // I will fire first
      },
    });
};
export const useUpdateTableSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: updateTableSession, // Hàm API để thực hiện update
      onSuccess: (data,variables) => {
        // Sau khi thành công, invalid cache cho 'products' để fetch lại dữ liệu
        // 2. Cập nhật cache ngay lập tức cho sản phẩm cụ thể
        
      },
      onError: (error: any) => {

      },
    });
  };

  export const useDeleteTableSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn:deleteTableSession,
      onSuccess: (_, id) => {
        // 1. Xóa sản phẩm khỏi danh sách products
        queryClient.setQueryData(['TableSessions'], (old: any) => 
          old.filter((product: any) => product.id !== id)
        );
        // 2. Xóa cache của sản phẩm riêng lẻ nếu có
        queryClient.removeQueries({ queryKey: ['TableSession', id] });
        // 3. Thông báo thành công
        alert('Product deleted successfully!');
      },
      // Tùy chọn: Optimistic updates
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ['TableSessionss'] });
        const previousProducts = queryClient.getQueryData(['TableSessions']);
        queryClient.setQueryData(['TableSessions'], (old: any) => 
          old.filter((product: any) => product.id !== id)
        );
        return { previousProducts };
      },
      onSettled: () => {
        // Đảm bảo dữ liệu đồng bộ với server
        queryClient.invalidateQueries({ queryKey: ['TableSessions'] });
      },
    });
  };
  export const useRewardTableSession = () =>{
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: fetchRewardTableSession, // Hàm API để thực hiện update
      onSuccess: (data,variables) => {
        // Sau khi thành công, invalid cache cho 'products' để fetch lại dữ liệu
        // 2. Cập nhật cache ngay lập tức cho sản phẩm cụ thể
        queryClient.setQueryData(['TableSession', variables.id], data);
      },
      onError: (error: any) => {

      },
    });
  }
