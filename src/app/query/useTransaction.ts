import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import {fetchTransactions, fetchTransaction, createTransaction, updateTransaction, deleteTransaction} from '../api/apiTransaction'
import { TransactionFormSearch } from '../type/model/Transaction';
export const useTransactions = (page: number, limit: number, formData:TransactionFormSearch) => {
  return useQuery({
    queryKey:['transactions',page, limit, formData],
    queryFn: async () =>{
        return await fetchTransactions(page,limit,formData)
    },
    staleTime:1000*6,
    refetchOnWindowFocus: false, // ✅ KHÔNG refetch khi quay lại tab
    })
};
export const useTransaction = (id:number) => {
    return useQuery({
        queryKey:['transaction', id],
        queryFn: async () => {
            return await fetchTransaction(id)
        },
        staleTime:1000*6,
        refetchOnWindowFocus: false, // ✅ KHÔNG refetch khi quay lại tab
    })
  };

export const useCreateTransaction = () => {
    return useMutation({
        mutationFn:createTransaction,
        onSuccess: (data, variables, context) => {
        // I will fire first
        },
        onError: (error, variables, context) => {
        // I will fire first
        },
      });
};
export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: updateTransaction, // Hàm API để thực hiện update
      onSuccess: (data,variables) => {
        // Sau khi thành công, invalid cache cho 'products' để fetch lại dữ liệu
        // 2. Cập nhật cache ngay lập tức cho sản phẩm cụ thể
        // queryClient.setQueryData(['transaction', variables.id], data);
      },
      onError: (error: any) => {

      },
    });
  };

  export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: deleteTransaction,
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ['transactions'] });
  
        const previousData = queryClient.getQueryData(['transactions']);
  
        queryClient.setQueryData(['transactions'], (old: any) =>
          old ? old.filter((item: any) => item.id !== id) : []
        );
  
        return { previousData };
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
      },
      onError: (err, _, context) => {
        // Rollback nếu mutation lỗi
        if (context?.previousData) {
          queryClient.setQueryData(['transactions'], context.previousData);
        }
      },
    });
  };
  
