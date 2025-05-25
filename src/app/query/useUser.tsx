import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import { apiCreateCustomer, apiFindCustomer, apiGetAllCustomer, apigetUser, apiLogin, apiSearchCustomer, apiUpdateCustomer } from '../api/apiUser';
import { CustomerFormSearch } from '../type/model/Customer';
export const useLogin = () =>{
    return useMutation({
        mutationFn:apiLogin,
        onSuccess: (data, variables, context) => {
        // I will fire first
        },
        onError: (error, variables, context) => {
        // I will fire first
        },
    });
} 
export const useCreateCustomer = () =>{
    return useMutation({
        mutationFn:apiCreateCustomer,
        onSuccess: (data, variables, context) => {
        // I will fire first
        },
        onError: (error, variables, context) => {
        // I will fire first
        },
    });
} 
export const useUpdateCustomer = () =>{
    return useMutation({
        mutationFn:apiUpdateCustomer,
        onSuccess: (data, variables, context) => {
        // I will fire first
        },
        onError: (error, variables, context) => {
        // I will fire first
        },
    });
} 
export const useFindCustomer = () =>{
    return useMutation({
        mutationFn:apiFindCustomer,
        onSuccess: (data, variables, context) => {
        // I will fire first
        },
        onError: (error, variables, context) => {
        // I will fire first
        },
    });
} 
export const useGetUser = (id: number) => {
return useQuery({
    queryKey:['user',id],
    queryFn: async () =>{
        return await apigetUser(id)
    },
    staleTime:1000*6,
    })
};
export const usegetAllUsers = (page: number, limit: number, formData:CustomerFormSearch) => {
    return useQuery({
        queryKey:['customers',page, limit, formData],
        queryFn: async () =>{
            return await apiGetAllCustomer(page,limit,formData)
        },
        staleTime:1000*6,
        refetchOnWindowFocus: false, // ✅ KHÔNG refetch khi quay lại tab
        })
    };
    export const useSearchCustomer = (name:string) =>{
        return useQuery({
            queryKey: ['customer', name],
            queryFn: async () => await apiSearchCustomer(name),
            enabled: name.length >= 2,
            staleTime:1000*6,
            refetchOnWindowFocus: false, // ✅ KHÔNG refetch khi quay lại tab
        });
    } 
