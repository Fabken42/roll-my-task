'use client'
import { useTaskStore } from '@/store/useTaskStore'
import { Dice3 } from 'lucide-react'

export default function RandomTaskButton() {
  const selectedTask = useTaskStore((state) => state.selectedTask)
  const completeRandomTask = useTaskStore((state) => state.completeRandomTask)
  const tasks = useTaskStore((state) => state.tasks)

  const handleClick = () => {
    completeRandomTask()
  }

  const getMessage = () => {
    if (selectedTask === null) return 'Nenhuma tarefa selecionada!'
    if (selectedTask === '__NONE_LEFT__') return 'Você concluiu todas as tarefas!'
    return `Tarefa selecionada: ${selectedTask}`
  }

  return (
    <div className="flex flex-col items-center mb-6">
      <button
        onClick={handleClick}
        className="bg-[#445] text-[#eee] p-4 rounded-full transition duration-300 ease-in-out hover:scale-105 hover:bg-[#556]"
      >
        <Dice3 size={36} />
      </button>
      <p className="mt-4 text-2xl font-extrabold text-center break-words">
        {getMessage()}
      </p>
    </div>
  )
}
