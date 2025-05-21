import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import { apiCreateCustomer, apiFindCustomer, apiGetAllCustomer, apigetUser, apiLogin, apiUpdateCustomer } from '../api/apiUser';
import { FormSearch } from '../conponent/customer/Index';
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
export const usegetAllUsers = (page: number, limit: number, formData:FormSearch) => {
    return useQuery({
        queryKey:['customers',page, limit, formData],
        queryFn: async () =>{
            return await apiGetAllCustomer(page,limit,formData)
        },
        staleTime:1000*6,
        })
    };
