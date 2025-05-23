import { Employee } from "@/types";
import { create } from "zustand";

interface EmployeeStoreData extends Partial<Employee> {
  errors: Record<string, string[]>;
}

interface EmployeeStore extends EmployeeStoreData {
  set: (name: keyof EmployeeStoreData, value: any) => void;
  resetError: (name?: keyof EmployeeStoreData) => void;
  reset: () => void;
  getEmployee: () => Partial<Employee>;
  setEmployee: (data: Partial<Employee>) => void;
}

const initialState: EmployeeStoreData = {
  id: -1,
  phone: "",
  errors: {},
};

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  ...initialState,
  set: (name: keyof EmployeeStoreData, value: any) => {
    set((state) => ({
      ...state,
      [name]: value,
    }));
  },
  resetError: (name?: keyof EmployeeStoreData) => {
    if (name) {
      set((state) => ({
        ...state,
        errors: { ...state.errors, [name]: [] },
      }));
    } else {
      set((state) => ({
        ...state,
        errors: {},
      }));
    }
  },
  reset: () => {
    set({ ...initialState });
  },

  getEmployee: () => {
    const data = get();
    return {
      phone: data.phone,
    };
  },

  setEmployee: (data: Partial<Employee>) => {
    set((state) => ({
      ...state,
      id: data.id,
      phone: data.phone,
    }));
  },
}));
