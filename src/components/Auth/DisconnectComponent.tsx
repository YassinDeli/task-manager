import { useAuthPersistStore } from "@/hooks/stores/useAuthPersistStore";
import { useRouter } from "next/router";
import React from "react";

export function DisconnectComponent() {
  const router = useRouter();
  const authPersistStore = useAuthPersistStore();

  React.useEffect(() => {
    router.replace("/");
    authPersistStore.logout();
  }, []);
  return null;
}
