// hooks/stores/useTaskStore.ts
import { Task, Status, Priority, User } from "@/types";
import { create } from "zustand";

interface TaskStoreData extends Partial<Task> {
  errors: Record<string, string[]>;
}

interface TaskStore extends TaskStoreData {
  set: (name: keyof TaskStoreData, value: any) => void;
  resetError: (name: keyof TaskStoreData) => void;
  reset: () => void;
  getTask: () => Partial<Task>;
  setTask: (data: Partial<Task>) => void;
}

const initialState: TaskStoreData = {
  id: undefined,
  title: "",
  description: "",
  status: "TODO" as Status,
  priority: "MEDIUM" as Priority,
  dueDate: null,
  employeeId: undefined,
  projectId: undefined,
  userId: undefined,
  user: undefined,
  errors: {},
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  ...initialState,

  set: (name: keyof TaskStoreData, value: any) => {
    set((state) => ({
      ...state,
      [name]: value,
    }));
  },
  resetError: (name: keyof TaskStoreData) => {
    set((state) => ({
      ...state,
      errors: { ...state.errors, [name]: [] },
    }));
  },
  reset: () => {
    set({ ...initialState });
  },

  getTask: (): Partial<Task> => {
    const data = get();
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      employeeId: data.employeeId,
      projectId: data.projectId,
      userId: data.userId,
      user: data.user,
    };
  },

  setTask: (data: Partial<Task>) => {
    set((state) => {
      return {
        ...state,
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        employeeId: data.employeeId,
        projectId: data.projectId,
        userId: data.userId,
        user: data.user,
      };
    });
  },
}));
