import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import { apiCreateEmployee, apiGetAllEmployee, apigetEmployee, apiGetEmployeeSchedule, apiUpdateEmployee } from '../api/apiEmployee';
import { EmployeeFormSearch } from '../type/model/Employee';
import { apiGetAllShift } from '../api/shift';
export const  useCreateShift= () =>{
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
export const useUpdateShift = () =>{
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
 
export const useGetShift = (id: number) => {
return useQuery({
    queryKey:['employee',id],
    queryFn: async () =>{
        return await apigetEmployee(id)
    },
        staleTime:1000*3,
    })
};
export const usegetAllShift = () => {
    return useQuery({
        queryKey:['shifts'],
        queryFn: apiGetAllShift,
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
