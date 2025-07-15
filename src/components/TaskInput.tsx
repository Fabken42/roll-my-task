'use client'
import { useState } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { Plus } from 'lucide-react'
import { MAX_TASK_NAME_LENGTH, MAX_TASKS } from '@/utils/constants'
import Swal from 'sweetalert2'

export default function TaskInput() {
  const [title, setTitle] = useState('')
  const addTask = useTaskStore((state) => state.addTask)
  const tasks = useTaskStore((state) => state.tasks)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() === '') return
    if (tasks.length >= MAX_TASKS) {
      Swal.fire({
        title: 'Limite atingido!',
        text: `Máximo de ${MAX_TASKS} tarefas permitidas!`,
        icon: 'warning',
        background: '#445',
        color: '#eee',
      })
      return
    }
    addTask(title.trim())
    setTitle('')
  }

  return (
    <form
  onSubmit={handleSubmit}
  className="flex flex-col gap-1 mb-3 w-full mx-auto"
>
  <label 
    htmlFor="task-title" 
    className="text-[#eee]"
  >
    Digite uma tarefa:
  </label>
  <div className="flex gap-2">
    <input
      id="task-title"
      type="text"
      maxLength={MAX_TASK_NAME_LENGTH}
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder={`[máximo ${MAX_TASK_NAME_LENGTH} caracteres]`}
      className="flex-grow bg-[#445] text-[#eee] rounded p-2 break-words overflow-wrap break-word"
    />
    <button
      type="submit"
      className="bg-[#445] text-[#eee] p-2 rounded hover:opacity-80 transition"
    >
      <Plus />
    </button>
  </div>
</form>
  )
}
