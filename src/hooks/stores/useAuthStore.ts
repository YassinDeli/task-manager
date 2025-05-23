import { create } from "zustand";

interface AuthData {
  usernameOrEmail: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  errors?: Record<string, string>;
}

interface AuthStore extends AuthData {
  set: (attribute: keyof AuthData, value: unknown) => void;
  get: () => Partial<AuthData>;
  reset: () => void;
  resetError: (attribute: keyof AuthData) => void;
  resetErrors: () => void;
}

const AuthDataDefaults: AuthData = {
  usernameOrEmail: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  errors: {},
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...AuthDataDefaults,
  set: (attribute: keyof AuthData, value: unknown) => {
    set((state) => ({
      ...state,
      [attribute]: value,
    }));
  },
  get: () => {
    const data = get();
    return {
      usernameOrEmail: data.usernameOrEmail,
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };
  },
  reset: () => {
    set(AuthDataDefaults);
  },
  resetError: (attribute: keyof AuthData) => {
    set((state) => ({
      ...state,
      errors: { ...state.errors, [attribute]: "" },
    }));
  },
  resetErrors: () => {
    set((state) => ({
      ...state,
      errors: {},
    }));
  },
}));
