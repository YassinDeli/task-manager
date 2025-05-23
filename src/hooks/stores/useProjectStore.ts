import { Priority, Project, ProjectStatus } from "@/types/project";
import { Employee } from "@/types/entreprise";
import {  User } from "@/types/project";
import { create } from "zustand";

interface ProjectStoreData {
  id?: number;
  name?: string;
  description?: string | null;
  startDate?: Date;
  endDate?: Date | null;
  status?: ProjectStatus;
  priority?: Priority;
  responsibleId?: number | null;
  responsible?: Employee | null;
  userId?: string | null;
  user?: User | null;
  errors: Record<string, string[]>;
}

interface ProjectStore extends ProjectStoreData {
  set: (name: keyof ProjectStoreData, value: any) => void;
  resetError: (name?: keyof ProjectStoreData) => void;
  reset: () => void;
  getProject: () => Partial<Project>;
  setProject: (data: Partial<Project>) => void;
}

const initialState: ProjectStoreData = {
  id: undefined,
  name: "",
  description: "",
  startDate: undefined,
  endDate: null,
  status: undefined,
  priority: undefined,
  responsibleId: null,
  responsible: null,
  userId: null,
  user: null,
  errors: {},
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  ...initialState,
  set: (name: keyof ProjectStoreData, value: any) => {
    set((state) => ({
      ...state,
      [name]: value,
    }));
  },
  resetError: (name?: keyof ProjectStoreData) => {
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
  getProject: () => {
    const data = get();
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      priority: data.priority,
      responsibleId: data.responsibleId,
      responsible: data.responsible,
      userId: data.userId,
      user: data.user,
    };
  },
  setProject: (data: Partial<Project>) => {
    set((state) => ({
      ...state,
      id: data.id,
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      priority: data.priority,
      responsibleId: data.responsibleId,
      responsible: data.responsible,
      userId: data.userId,
      user: data.user,
    }));
  },
}));
