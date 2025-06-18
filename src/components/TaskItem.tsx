'use client'
import { useTaskStore } from '@/store/useTaskStore'
import { Trash, Check } from 'lucide-react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

type Props = {
  id: string
  title: string
  completed: boolean
}

export default function TaskItem({ id, title, completed }: Props) {
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const updateTask = useTaskStore((state) => state.updateTask)


  const handleDelete = () => {
    Swal.fire({
      title: 'Excluir tarefa',
      text: 'Deseja mesmo remover esta tarefa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      background: '#445',
      color: '#eee'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTask(id)
        Swal.fire({
          title: 'Excluída!',
          text: 'A tarefa foi removida.',
          icon: 'success',
          background: '#445',
          color: '#eee'
        })
      }
    })
  }

  const handleTitleChange = () => {
    Swal.fire({
      title: 'Editar tarefa',
      input: 'text',
      inputValue: title,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      background: '#445',
      color: '#eee',
      inputValidator: (value) => {
        if (!value.trim()) {
          return 'O título não pode ser vazio!'
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value.trim()) {
        updateTask(id, result.value.trim())
      }
    })
  }

  return (
    <div
      className={`flex justify-between items-center p-3 rounded border border-[#445] transition-colors duration-200 ${completed ? 'bg-green-700' : 'bg-[#445]'
        }`}
    >
      <span
        className={`flex-1 cursor-pointer text-center ${completed ? 'opacity-85' : ''}`}
        onClick={handleTitleChange}
      >
        {title}
      </span>
      <div className="flex gap-2 ml-2">
        <button
          onClick={() => toggleTask(id)}
          className="text-green-300 hover:opacity-80 transition rounded-full p-1"
        >
          <Check size={18} />
        </button>
        <button
          onClick={handleDelete}
          className="text-red-400 hover:opacity-80 transition rounded-full p-1"
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  )
}
