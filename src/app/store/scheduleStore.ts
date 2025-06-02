import { ReactNode } from 'react';
import { create } from 'zustand'
import { Shift } from '../type/model/Shift';
import { Employee } from '../type/model/Employee';


type ScheduleState = {
    shifts: Shift[];
    employees:Employee[];
    setShifts: (shifts: Shift[]) => void;
    setEmployees: (employees: Employee[]) => void;

}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
    shifts: [],
    employees: [],
    setShifts: (shifts) =>
    set({
      shifts
    }),
    setEmployees: (employees) =>
    set({
        employees
    }),
}))