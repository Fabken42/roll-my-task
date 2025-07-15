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
  selectedTaskId: string | null
  triggerBounceId: string | null
  isActive: boolean
  setIsActive: (active: boolean) => void
  setTriggerBounceId: (id: string | null) => void
  updateSelectedTaskId: (id: string | null) => void
  addTask: (title: string) => void
  updateTask: (id: string, title: string) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  completeRandomTask: () => Task | null
  clearSelectedTask: () => void
  deleteAllTasks: () => void
  resetAllTasks: () => void
  completeSelectedTask: () => void
  selectRandomTask: () => Task | null
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      selectedTaskId: null,
      triggerBounceId: null,
      isActive: false,
      setIsActive: (active) => set({ isActive: active }),
      setTriggerBounceId: (id) => set({ triggerBounceId: id }),
      updateSelectedTaskId: (id) => {
        set({ selectedTaskId: id })
      },
      deleteAllTasks: () => set({ tasks: [], selectedTaskId: null }),
      resetAllTasks: () =>
        set((state) => ({
          tasks: state.tasks.map((task) => ({ ...task, completed: false })),
          selectedTaskId: null,
        })),
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
          set({ selectedTaskId: null }) // Remove a flag especial
          return null
        }
        const randomTask = incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)]
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === randomTask.id ? { ...task, completed: true } : task
          ),
          selectedTaskId: randomTask.id // Armazena o ID
        }))
        return randomTask
      },
      clearSelectedTask: () => set({ selectedTaskId: null }),
      selectRandomTask: () => {
        const incompleteTasks = get().tasks.filter((task) => !task.completed)
        if (incompleteTasks.length === 0) {
          set({ selectedTaskId: null })
          return null
        }
        const randomTask = incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)]
        set({ selectedTaskId: randomTask.id })
        return randomTask
      },
      completeSelectedTask: () => {
        set((state) => {
          if (!state.selectedTaskId) return state

          return {
            tasks: state.tasks.map((task) =>
              task.id === state.selectedTaskId ? { ...task, completed: true } : task
            ),
            selectedTaskId: null // Limpa a tarefa selecionada após completar
          }
        })
      },
    }),
    { name: 'task-storage' }
  )
)
