import KanbanBoard from "@/components/Tasks/Kanban/kanban-board";
import TasksTasks from "@/components/Tasks/TasksTasks";

export default function page() {
  return (
    <div className="h-full overflow-x-auto pb-4">
      <TasksTasks className="">
        <KanbanBoard className="" />
      </TasksTasks>
    </div>
  );
}
