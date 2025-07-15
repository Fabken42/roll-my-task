
'use client'
import { useTaskStore } from '@/store/useTaskStore'
import TaskItem from './TaskItem'
import { CheckCircle, Circle, Trash2, RotateCcw } from 'lucide-react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export default function TaskList() {
  const tasks = useTaskStore((state) => state.tasks)
  const deleteAllTasks = useTaskStore((state) => state.deleteAllTasks)
  const resetAllTasks = useTaskStore((state) => state.resetAllTasks)

  const total = tasks.length
  const completed = tasks.filter((task) => task.completed).length
  const pending = total - completed

  const handleDeleteAll = () => {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja excluir todas as tarefas?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir todas!',
      background: '#445',
      color: '#eee',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAllTasks()
        Swal.fire({
          title: 'Todas excluídas!',
          text: 'Sua lista de tarefas foi apagada.',
          icon: 'success',
          background: '#445',
          color: '#eee',
        })
      }
    })
  }

  const handleResetAll = () => {
    Swal.fire({
      title: 'Resetar tarefas?',
      text: 'Isso marcará todas como pendentes.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#555',
      confirmButtonText: 'Sim, resetar!',
      background: '#445',
      color: '#eee',
    }).then((result) => {
      if (result.isConfirmed) {
        resetAllTasks()
      }
    })
  }

  return (
    <div className="space-y-3 pt-4 w-full mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 text-sm text-[#eee]">
          <span className='text-[1.1em]'>Total: {total}</span>
          <span className="flex items-center gap-1 text-[1.1em]">
            <CheckCircle size={18} /> {completed}
          </span>
          <span className="flex items-center gap-1 text-[1.1em]">
            <Circle size={18} /> {pending}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={handleResetAll} className="hover:opacity-80 transition text-blue-300">
            <RotateCcw size={18} />
          </button>
          <button onClick={handleDeleteAll} className="hover:opacity-80 transition text-red-400">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {tasks.map((task) => (
        <TaskItem key={task.id} {...task} />
      ))}
    </div>
  )
}
