"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { user } from "@/api/users";
import { User } from "@/types";

interface TeamMember {
  userId: string;
  role?: string;
}

interface TeamMembersCardProps {
  teamMembers?: TeamMember[];
  projectTasks?: Array<{
    userId: string | null;
  }>;
  responsibleId?: string | null;
}

export function TeamMembersCard({
  teamMembers = [],
  projectTasks = [],
  responsibleId,
}: TeamMembersCardProps) {
  // Get all unique user IDs including responsible
  const getUserIds = () => {
    const userIds = new Set<string>();

    if (responsibleId) userIds.add(responsibleId);

    teamMembers.forEach((member) => {
      if (member.userId) userIds.add(member.userId);
    });

    projectTasks.forEach((task) => {
      if (task.userId) userIds.add(task.userId);
    });

    return Array.from(userIds);
  };

  const userIds = getUserIds();

  // Fetch user details for all unique user IDs
  const { data: users, isLoading } = useQuery({
    queryKey: ["teamMembersCardUsers", userIds],
    queryFn: async () => {
      const userPromises = userIds.map((id) => user.findById(id));
      const results = await Promise.allSettled(userPromises);
      return results
        .filter((result) => result.status === "fulfilled")
        .map((result) => (result as PromiseFulfilledResult<User>).value);
    },
    enabled: userIds.length > 0,
  });

  const getInitials = (username?: string | null) => {
    return username?.charAt(0)?.toUpperCase() || "?";
  };

  const getDisplayName = (username?: string | null) => {
    return username || "Unassigned";
  };

  const getRole = (userId: string) => {
    if (userId === responsibleId) return "Responsible";
    return (
      teamMembers.find((member) => member.userId === userId)?.role ||
      "Task Assignee"
    );
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardDescription>Team Members</CardDescription>
          <CardTitle className="text-2xl">...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardDescription>Team Members</CardDescription>
          <CardTitle className="text-2xl">0</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            No team members
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardDescription>Team Members</CardDescription>
        <CardTitle className="text-2xl">{users.length}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 justify-start">
        {users.slice(0, 2).map((user) => {
          const displayName = getDisplayName(user.username);
          const role = getRole(user.id);

          return (
            <div
              key={user.id}
              className="flex items-center gap-2 p-2 border rounded-xl bg-white shadow-sm hover:shadow-md transition"
            >
              <Avatar className="border-2 border-background h-10 w-10">
                <AvatarImage
                  src={user.image || "/placeholder.svg?height=40&width=40"}
                  alt={displayName}
                />
                <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium block">{displayName}</span>
                <span className="text-xs text-muted-foreground block">
                  {role}
                </span>
              </div>
            </div>
          );
        })}

        {users.length > 2 && (
          <div className="flex items-center justify-center w-full pt-2">
            <span className="text-sm text-muted-foreground">
              +{users.length - 2} more members
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
