'use client'
import { useTaskStore } from '@/store/useTaskStore'
import TaskItem from './TaskItem'

export default function TaskList() {
  const tasks = useTaskStore((state) => state.tasks)

  return (
    <div className="space-y-3 pt-4 w-full max-w-3xl mx-auto">
      {tasks.map((task) => (
        <TaskItem key={task.id} {...task} />
      ))}
    </div>
  )
}
