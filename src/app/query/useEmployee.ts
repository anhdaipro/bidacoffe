import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import { apiCreateCustomer, apiFindCustomer, apiGetAllCustomer, apigetUser, apiLogin, apiSearchCustomer, apiUpdateCustomer } from '../api/apiUser';
import { CustomerFormSearch } from '../type/model/Customer';
import { apiCreateEmployee, apiGetAllEmployee, apigetEmployee, apiGetEmployeeSchedule, apiUpdateEmployee } from '../api/apiEmployee';
import { EmployeeFormSearch } from '../type/model/Employee';
export const useCreateEmployee = () =>{
    return useMutation({
        mutationFn:apiCreateEmployee,
        onSuccess: (data, variables, context) => {
        // I will fire first
        },
        onError: (error, variables, context) => {
        // I will fire first
        },
    });
} 
export const useUpdateEmployee = () =>{
    return useMutation({
        mutationFn:apiUpdateEmployee,
        onSuccess: (data, variables, context) => {
        // I will fire first
        },
        onError: (error, variables, context) => {
        // I will fire first
        },
    });
} 
 
export const useGetEmployee = (id: number) => {
return useQuery({
    queryKey:['employee',id],
    queryFn: async () =>{
        return await apigetEmployee(id)
    },
        staleTime:1000*3,
    })
};
export const usegetAllEmployee = (page: number, limit: number, formData:EmployeeFormSearch) => {
    return useQuery({
        queryKey:['employees',page, limit, formData],
        queryFn: async () =>{
            return await apiGetAllEmployee(page,limit,formData)
        },
        staleTime:1000*6,
        refetchOnWindowFocus: false, // ✅ KHÔNG refetch khi quay lại tab
        })
    };
export const useGetEmployeeSchedule = () =>{
    return useQuery({
        queryKey: ['employeeSchedule'],
        queryFn: apiGetEmployeeSchedule,
        staleTime:1000*6,
        refetchOnWindowFocus: false, // ✅ KHÔNG refetch khi quay lại tab
    });
} 
