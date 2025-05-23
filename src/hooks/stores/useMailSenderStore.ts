import { Mail } from "@/types";
import { create } from "zustand";

interface MailSenderData {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  type: "plain" | "html" | "markdown";
  errors: Record<string, string>;
}

interface MailSenderStore extends MailSenderData {
  set: (attribute: keyof MailSenderData, value: unknown) => void;
  get: () => Omit<MailSenderData, "errors">;
  reset: () => void;
  resetError: (attribute: keyof MailSenderData) => void;
  resetErrors: () => void;
}

const MailSenderDataDefaults: MailSenderData = {
  to: [],
  cc: [],
  bcc: [],
  subject: "",
  body: "",
  type: "plain",
  errors: {},
};

export const useMailSenderStore = create<MailSenderStore>((set, get) => ({
  ...MailSenderDataDefaults,
  set: (attribute: keyof MailSenderData, value: unknown) => {
    set((state) => ({
      ...state,
      [attribute]: value,
    }));
  },
  get: () => {
    const data = get();
    return {
      to: data.to,
      cc: data.cc,
      bcc: data.bcc,
      subject: data.subject,
      body: get().body,
      type: data.type,
    };
  },
  reset: () => {
    set(MailSenderDataDefaults);
  },
  resetError: (attribute: keyof MailSenderData) => {
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
