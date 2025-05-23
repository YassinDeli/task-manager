"use client";

import { useProjectStore } from "@/hooks/stores/useProjectStore";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useUsers } from "@/hooks/content/useUsers";
import { Users, UserCheck, AlertCircle, Search, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserSelectionProps {
  className?: string;
  onComplete?: () => void;
}

export const UserSelection = ({
  className,
  onComplete,
}: UserSelectionProps) => {
  const { t } = useTranslation();
  const projectStore = useProjectStore();
  const { users, isFetchUsersPending } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter users based on search query
  const filteredUsers = users?.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.label?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected user details
  const selectedUser = users?.find(
    (user) => user.id?.toString() === projectStore.userId
  );

  // Handle user selection
  const handleUserSelect = (value: string) => {
    projectStore.set("userId", value);
    projectStore.resetError("userId");
  };

  return (
    <Card className={cn("w-full shadow-sm", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle>{t("User Selection")}</CardTitle>
        </div>
        <CardDescription>
          {t("Select the user who will be responsible for this project")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isFetchUsersPending ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User selection */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                {t("Select User")}
              </label>
              <Select
                value={projectStore.userId || ""}
                onValueChange={handleUserSelect}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("Select a user for this project")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("Available Users")}</SelectLabel>
                    {filteredUsers && filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <SelectItem
                          key={user.id}
                          value={user.id?.toString() || ""}
                          className="py-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={`https://avatar.vercel.sh/${user.username}.png`}
                                alt={user.username}
                              />
                              <AvatarFallback>
                                {user.username?.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.username}</span>
                            {user.role?.label && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {user.role.label}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                        {searchQuery
                          ? t("No users match your search")
                          : t("No users available")}
                      </div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {projectStore.errors?.userId && (
                <div className="flex items-center gap-1.5 mt-1.5 text-destructive text-sm">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{projectStore.errors.userId[0]}</span>
                </div>
              )}
            </div>

            {/* Selected user details */}
            {selectedUser && (
              <div className="mt-6 border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">{t("Selected User Details")}</h3>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${selectedUser.username}.png`}
                        alt={selectedUser.username}
                      />
                      <AvatarFallback>
                        {selectedUser.username?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedUser.username}</p>
                      {selectedUser.role?.label && (
                        <Badge variant="secondary" className="mt-1">
                          {selectedUser.role.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Help text */}
            <div className="flex items-start gap-2 text-sm text-muted-foreground mt-4 bg-blue-50 p-3 rounded-md">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p>
                {t(
                  "The selected user will be responsible for managing this project and will receive notifications about project updates."
                )}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
