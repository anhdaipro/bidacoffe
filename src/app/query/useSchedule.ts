import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import { apiCreateEmployee, apiGetAllEmployee, apigetEmployee, apiGetEmployeeSchedule, apiUpdateEmployee } from '../api/apiEmployee';
import { EmployeeFormSearch } from '../type/model/Employee';
import { apiCreateShift, apiGetAllShift, apiUpdateShift } from '../api/shift';
import { Shift } from '../type/model/Shift';
import { apiCreateSchedules, fetchSchedules, fetchScheduleWeekly } from '../api/apiSchedule';
import { ScheduleFormSearch } from '../type/model/Schedule';
export const  useCreateSchedules = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:apiCreateSchedules,
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
export const createScheduleShift = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:apiUpdateShift,
        onSuccess: (data, variables, context) => {
            const updatedShift = data.data;
            // queryClient.setQueryData(['shifts'], (oldShifts: Shift[] = []) => {
            //     return oldShifts.map((shift) =>
            //         shift.id == updatedShift.id ? updatedShift : shift
            //     );
            // });
        // I will fire first
        },
        onError: (error, variables, context) => {
        // I will fire first
        },
    });
} 
 
export const useGetSchedules = (formData:ScheduleFormSearch) => {
    return useQuery({
        queryKey:['schedules',formData],
        queryFn:async () =>{
            const res = await fetchSchedules(formData);
            return res
        },
        staleTime:1000*1,
        enabled: !!formData.dateFrom, // Chỉ gọi API khi có dateFrom
        refetchOnWindowFocus: false, // ✅ KHÔNG refetch khi quay lại tab
        })
    };
export const useGetScheduleWeekly = (date:string) => {
    return useQuery({
        queryKey:['schedules',date],
        queryFn:async () =>{
            const res = await fetchScheduleWeekly(date);
            return res
        },
        staleTime:1000*1,
        enabled: !!date, // Chỉ gọi API khi có dateFrom
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
