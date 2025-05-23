import { api } from "@/api";
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
import { useAuthStore } from "@/hooks/stores/useAuthStore";
import { cn } from "@/lib/utils";
import {
  ConnectResponse,
  RegisterPayload,
  registerSchema,
  ServerErrorResponse,
  ServerResponse,
} from "@/types";
import { useMutation } from "@tanstack/react-query";
import { da } from "date-fns/locale";
import { toast } from "sonner";

export const description =
  "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account.";

interface RegisterComponentProps {
  className?: string;
}

export function RegisterComponent({ className }: RegisterComponentProps) {
  const authStore = useAuthStore();

  const { mutate: register, isPending: isRegisterationPending } = useMutation({
    mutationFn: (payload: RegisterPayload) => api.auth.register(payload),
    onSuccess: (response: ServerResponse<ConnectResponse>) => {
      toast.success(response.message);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data.error);
    },
  });

  const handleRegister = () => {
    const registerObject = {
      username: authStore.username,
      email: authStore.email,
      password: authStore.password,
      confirmPassword: authStore.confirmPassword,
    };
    const result = registerSchema.safeParse(registerObject);
    if (!result.success) {
      authStore.set("errors", result.error.flatten().fieldErrors);
    } else {
      authStore.resetErrors();
      register(registerObject);
    }
  };

  return (
    <Card className={cn("mx-auto max-w-sm", className)}>
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Aa"
              className={cn(
                authStore?.errors?.username?.[0] && "border-red-500"
              )}
              value={authStore.username}
              onChange={(e) => {
                authStore.set("username", e.target.value);
                authStore.resetError("username");
              }}
              disabled={isRegisterationPending}
            />
            {authStore?.errors?.username?.[0] && (
              <p className="text-red-500 text-xs font-bold">
                {authStore.errors.username[0]}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className={cn(authStore?.errors?.email?.[0] && "border-red-500")}
              value={authStore.email}
              onChange={(e) => {
                authStore.set("email", e.target.value);
                authStore.resetError("email");
              }}
              disabled={isRegisterationPending}
            />
            {authStore?.errors?.email?.[0] && (
              <p className="text-red-500 text-xs font-bold">
                {authStore.errors.email[0]}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
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
                authStore.resetError("password");
              }}
              disabled={isRegisterationPending}
            />
            {authStore?.errors?.password?.[0] && (
              <p className="text-red-500 text-xs font-bold">
                {authStore.errors.password[0]}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className={cn(
                authStore?.errors?.confirmPassword?.[0] && "border-red-500"
              )}
              value={authStore.confirmPassword}
              onChange={(e) => {
                authStore.set("confirmPassword", e.target.value);
                authStore.resetError("confirmPassword");
              }}
              disabled={isRegisterationPending}
            />
            {authStore?.errors?.confirmPassword?.[0] && (
              <p className="text-red-500 text-xs font-bold">
                {authStore.errors.confirmPassword[0]}
              </p>
            )}
          </div>
          <Button
            className="w-full"
            onClick={handleRegister}
            disabled={isRegisterationPending}
          >
            Register
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
