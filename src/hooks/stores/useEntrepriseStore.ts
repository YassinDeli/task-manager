import { Address, Entreprise } from "@/types";
import { create } from "zustand";

interface EntrepriseStoreData {
  id?: number;
  name?: string;
  address: Partial<Address>;
  phone?: string;
  email?: string;
  errors: Record<string, string[]>;
  addressErrors: Record<string, string[]>;
}

interface EntrepriseStore extends EntrepriseStoreData {
  set: (name: keyof EntrepriseStoreData, value: any) => void;
  setInAddress: (name: keyof Address, value: any) => void;
  resetError: (name?: keyof EntrepriseStoreData) => void;
  resetAddressError: (name?: keyof Address) => void;
  reset: () => void;
  getEntreprise: () => Partial<Entreprise>;
  getEntrepriseAddress: () => Partial<Address>;
  setEntreprise: (data: Partial<Entreprise>) => void;
}

const initialState: EntrepriseStoreData = {
  id: undefined,
  name: "",
  address: {
    address: "",
    address2: "",
    zipcode: "",
    region: "",
    countryId: undefined,
  },
  phone: "",
  email: "",
  errors: {},
  addressErrors: {},
};

export const useEntrepriseStore = create<EntrepriseStore>((set, get) => ({
  ...initialState,
  set: (name: keyof EntrepriseStoreData, value: any) => {
    set((state) => ({
      ...state,
      [name]: value,
    }));
  },
  setInAddress: (name: keyof Address, value: any) => {
    set((state) => ({
      ...state,
      address: {
        ...state.address,
        [name]: value,
      },
    }));
  },
  resetError: (name?: keyof EntrepriseStoreData) => {
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
  resetAddressError: (name?: keyof Address) => {
    if (name) {
      set((state) => ({
        ...state,
        addressErrors: { ...state.addressErrors, [name]: [] },
      }));
    } else {
      set((state) => ({
        ...state,
        addressErrors: {},
      }));
    }
  },
  reset: () => {
    set({ ...initialState });
  },

  getEntreprise: () => {
    const data = get();
    return {
      name: data.name,
      phone: data.phone,
      email: data.email,
    };
  },
  getEntrepriseAddress: (): Partial<Address> => {
    const data = get();
    return data.address;
  },

  setEntreprise: (data: Partial<Entreprise>) => {
    set((state) => ({
      ...state,
      id: data.id,
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
    }));
  },
}));
