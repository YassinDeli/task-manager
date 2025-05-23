import React from "react";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Spinner } from "./Common/Spinner";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Layout } from "./Layout/Layout";
import { useTheme } from "next-themes";
import AuthenticationPage from "./Auth/AuthenticationPage";
import { useAuthPersistStore } from "@/hooks/stores/useAuthPersistStore";

interface ApplicationProps {
  className?: string;
  Component: React.ComponentType<AppProps>;
  pageProps: AppProps;
}

function Application({ className, Component, pageProps }: ApplicationProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const authPersistStore = useAuthPersistStore();

  if (router.pathname.includes("admin")) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Spinner />
      </main>
    );
  }

  return (
    <div
      className={cn(
        `flex flex-col flex-1 min-h-screen max-h-screen`,
        className
      )}
    >
      {router.pathname.includes("auth") ? (
        <Component {...pageProps} />
      ) : authPersistStore.isAuthenticated ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <AuthenticationPage />
      )}
      <Toaster theme={theme == "dark" ? "dark" : "light"} />
    </div>
  );
}

export default Application;
