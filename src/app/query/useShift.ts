import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import { apiCreateEmployee, apiGetAllEmployee, apigetEmployee, apiGetEmployeeSchedule, apiUpdateEmployee } from '../api/apiEmployee';
import { EmployeeFormSearch } from '../type/model/Employee';
import { apiCreateShift, apiGetAllShift, apiUpdateShift } from '../api/shift';
import { Shift } from '../type/model/Shift';
export const  useCreateShift= () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:apiCreateShift,
        onSuccess: (data, variables, context) => {
            console.log(data);
            queryClient.setQueryData(['shifts'], (oldShifts:Shift[]) => {
                return [...oldShifts, data.data];
            });
        },
        onError: (error, variables, context) => {
        // I will fire first
        },
    });
} 
export const useUpdateShift = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:apiUpdateShift,
        onSuccess: (data, variables, context) => {
            const updatedShift = data.data;
            queryClient.setQueryData(['shifts'], (oldShifts: Shift[] = []) => {
                return oldShifts.map((shift) =>
                    shift.id == updatedShift.id ? updatedShift : shift
                );
            });
        // I will fire first
        },
        onError: (error, variables, context) => {
        // I will fire first
        },
    });
} 
 
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
