import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Goal } from "lucide-react";
import { connectSchema } from "@/types/validations/auth.validation";
import { cn } from "@/lib/utils";
import {
  ConnectPayload,
  ConnectResponse,
  ServerErrorResponse,
  ServerResponse,
} from "@/types";
import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/hooks/stores/useAuthStore";
import { useAuthPersistStore } from "@/hooks/stores/useAuthPersistStore";

export const description =
  "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account.";

export function ConnectComponent() {
  const authStore = useAuthStore();
  const authPersistStore = useAuthPersistStore();

  const { mutate: connect, isPending: isConnectPending } = useMutation({
    mutationFn: (payload: ConnectPayload) => api.auth.connect(payload),
    onSuccess: (response: ServerResponse<ConnectResponse>) => {
      authPersistStore.setAccessToken(response.data?.accessToken);
      authPersistStore.setRefreshToken(response.data?.refreshToken);
      authPersistStore.setAuthenticated(true);
      toast.success(response.message);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.error);
    },
  });

  const handleConnect = () => {
    const connectObject = {
      usernameOrEmail: authStore.usernameOrEmail,
      password: authStore.password,
    };
    const result = connectSchema.safeParse(connectObject);
    if (!result.success) {
      authStore.set("errors", result.error.flatten().fieldErrors);
    } else {
      connect(connectObject);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Connect</CardTitle>
        <CardDescription>
          Enter your email or username below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="usernameOrEmail">Username or E-mail</Label>
            <Input
              id="usernameOrEmail"
              type="text"
              placeholder="Aa"
              className={cn(
                authStore?.errors?.usernameOrEmail?.[0] && "border-red-500"
              )}
              value={authStore.usernameOrEmail}
              onChange={(e) => {
                authStore.set("usernameOrEmail", e.target.value);
                authStore.set("errors", {
                  ...authStore.errors,
                  usernameOrEmail: {},
                });
              }}
              disabled={isConnectPending}
            />
            {authStore?.errors?.usernameOrEmail?.[0] && (
              <p className="text-red-500 text-xs font-bold">
                {authStore.errors.usernameOrEmail[0]}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className={cn(
                authStore?.errors?.password?.[0] && "border-red-500"
              )}
              value={authStore.password}
              onChange={(e) => {
                authStore.set("password", e.target.value);
                authStore.set("errors", { ...authStore.errors, password: {} });
              }}
              disabled={isConnectPending}
            />
            {authStore?.errors?.password?.[0] && (
              <p className="text-red-500 text-xs font-bold">
                {authStore.errors.password[0]}
              </p>
            )}
          </div>
          <Button
            className="w-full"
            onClick={handleConnect}
            disabled={isConnectPending}
          >
            <Goal /> Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
