"use client";
import { useDrop } from "react-dnd";
import { CheckCircle, Clock, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

type TaskColumnProps = {
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  children: React.ReactNode;
  onDropTask: (id: string, status: "TODO" | "IN_PROGRESS" | "DONE") => void;
};

export function TaskColumn({
  title,
  status,
  children,
  onDropTask,
}: TaskColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "task",
    drop: (item: { id: string }) => {
      onDropTask(item.id, status);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      // @ts-ignore
      ref={drop}
      className={cn(
        "bg-muted/40 rounded-lg p-4 min-h-[500px]",
        isOver && "ring-2 ring-primary/50"
      )}
    >
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        {status === "TODO" && <ListTodo className="h-5 w-5 text-blue-500" />}
        {status === "IN_PROGRESS" && (
          <Clock className="h-5 w-5 text-amber-500" />
        )}
        {status === "DONE" && (
          <CheckCircle className="h-5 w-5 text-green-500" />
        )}
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
