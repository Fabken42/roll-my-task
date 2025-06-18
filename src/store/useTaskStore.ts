import { MAX_TASK_NAME_LENGTH } from '@/utils/constants'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Task = {
  id: string
  title: string
  completed: boolean
}

type TaskStore = {
  tasks: Task[]
  selectedTask: string | null
  addTask: (title: string) => void
  updateTask: (id: string, title: string) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  completeRandomTask: () => Task | null
  clearSelectedTask: () => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      selectedTask: null,
      addTask: (title) =>
        set((state) => ({
          tasks: [...state.tasks, { id: crypto.randomUUID(), title: title.slice(0, MAX_TASK_NAME_LENGTH), completed: false }],
        })),
      updateTask: (id, title) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, title } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      completeRandomTask: () => {
        const incompleteTasks = get().tasks.filter((task) => !task.completed)
        if (incompleteTasks.length === 0) {
          set({ selectedTask: '__NONE_LEFT__' }) // Flag interna para dizer "nenhuma pendente"
          return null
        }
        const randomTask =
          incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)]
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === randomTask.id ? { ...task, completed: true } : task
          ),
          selectedTask: randomTask.title,
        }))
        return randomTask
      },
      clearSelectedTask: () => set({ selectedTask: null }),
    }),
    { name: 'task-storage' }
  )
)
