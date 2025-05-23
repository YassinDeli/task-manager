"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { user } from "@/api/users";
import { User } from "@/types";

interface TeamTabProps {
  projectName: string;
  teamMembers?: Array<{
    userId: string;
    role?: string;
  }>;
  projectTasks?: Array<{
    userId: string | null;
  }>;
  responsibleId?: string | null;
}

export const TeamTab = ({
  projectName,
  teamMembers = [],
  projectTasks = [],
  responsibleId,
}: TeamTabProps) => {
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
    queryKey: ["teamUsers", userIds],
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

  const getTaskCount = (userId: string) => {
    return projectTasks.filter((task) => task.userId === userId).length;
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
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Loading user data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>People working on {projectName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No team members or contributors assigned yet
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Add Team Member</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Team</CardTitle>
        <CardDescription>People working on {projectName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => {
            const taskCount = getTaskCount(user.id);
            const role = getRole(user.id);
            const displayName = getDisplayName(user.username);

            return (
              <div
                key={user.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={user.image || "/placeholder.svg?height=40&width=40"}
                      alt={displayName}
                    />
                    <AvatarFallback>
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{displayName}</p>
                    <p className="text-sm text-muted-foreground">{role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {role !== "Responsible" && (
                    <Badge variant="outline" className="w-fit">
                      {taskCount} Task{taskCount !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add Team Member</Button>
      </CardFooter>
    </Card>
  );
};
