import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import { createPayment } from '../api/apiPayment';
export const useCreatePayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:createPayment,
        onSuccess: (data, variables, context) => {
        // I will fire first
        },
        onError: (error, variables, context) => {
        // I will fire first
        },
      });
};