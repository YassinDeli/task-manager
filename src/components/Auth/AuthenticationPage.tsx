import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import React from "react";
import { ConnectComponent } from "./ConnectComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterComponent } from "./RegisterComponent";
import { useAuthStore } from "@/hooks/stores/useAuthStore";

interface AuthenticationPageProps {
  className?: string;
}

export default function AuthenticationPage({
  className,
}: AuthenticationPageProps) {
  const router = useRouter();
  const authContext = React.useContext(AuthContext);
  const authStore = useAuthStore();
  React.useEffect(() => {
    if (authContext.authenticated) router.reload();
  }, []);
  return (
    <div
      className={`flex h-screen items-center justify-center ${className || ""}`}
    >
      <Tabs
        defaultValue="connect"
        className="w-[400px]"
        onValueChange={authStore.reset}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connect">Connect</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="connect">
          <ConnectComponent />
        </TabsContent>
        <TabsContent value="register">
          <RegisterComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
