'use client'
import { useTaskStore } from '@/store/useTaskStore'
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export default function RandomTaskButton() {
  const completeRandomTask = useTaskStore((state) => state.completeRandomTask)
  const selectedTask = useTaskStore((state) => state.selectedTask)
  const tasks = useTaskStore((state) => state.tasks)
  const [displayedTask, setDisplayedTask] = useState<string | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [currentDice, setCurrentDice] = useState<1 | 2 | 3 | 4 | 5 | 6>(3) // Começa com o Dice3
  const [bounce, setBounce] = useState(false)


  // Sequência de dados: 3 > 5 > 1 > 6 > 2 > 4
  // Modifique a declaração da diceSequence para:
  const diceSequence: Array<1 | 2 | 3 | 4 | 5 | 6> = [3, 5, 1, 6, 2, 4]
  const diceComponents = {
    1: <Dice1 size={36} />,
    2: <Dice2 size={36} />,
    3: <Dice3 size={36} />,
    4: <Dice4 size={36} />,
    5: <Dice5 size={36} />,
    6: <Dice6 size={36} />,
  }


  // Refs para os áudios
  const selectSoundRef = useRef<HTMLAudioElement | null>(null)

  // Efeito para carregar os sons quando o componente montar
  useEffect(() => {
    selectSoundRef.current = new Audio('/sounds/task-selected.mp3')
    selectSoundRef.current.volume = 0.5

    return () => {
      // Limpeza
      if (selectSoundRef.current) {
        selectSoundRef.current.pause()
        selectSoundRef.current = null
      }
    }
  }, [])

  const handleClick = () => {
    if (isRolling || tasks.length === 0) return

    const incompleteTasks = tasks.filter((task) => !task.completed)
    if (incompleteTasks.length === 0) {
      setDisplayedTask('Nenhuma tarefa pendente!')
      return
    }

    setIsRolling(true)
    setBounce(false)

    let rollCount = 0
    let delay = 100
    const maxRolls = 12

    const roll = () => {
      const nextDiceIndex = rollCount % diceSequence.length
      setCurrentDice(diceSequence[nextDiceIndex])

      const randomTask = incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)]
      setDisplayedTask(randomTask.title)
      rollCount++

      if (rollCount < maxRolls) {
        delay *= 1.1
        setTimeout(roll, delay)
      } else {
        const finalTask = completeRandomTask()
        setDisplayedTask(finalTask ? finalTask.title : 'Nenhuma tarefa pendente!')
        setIsRolling(false)
        setCurrentDice(3)
        setBounce(true)

        if (selectSoundRef.current) {
          selectSoundRef.current.currentTime = 0
          selectSoundRef.current.play().catch(e => console.error("Falha ao tocar som:", e))
        }
      }
    }
    roll()
  }

  const getMessage = () => {
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    let message;
    if (isRolling) message = displayedTask ?? 'Sorteando...';
    else if (displayedTask) message = displayedTask;
    else if (selectedTask === null) message = 'Nenhuma tarefa selecionada!';
    else if (selectedTask === '__NONE_LEFT__') message = 'Nenhuma tarefa pendente!';
    else message = selectedTask;

    return capitalize(message);
  }

  return (
    <div className="flex flex-col items-center mb-6">
      <button
        onClick={handleClick}
        disabled={isRolling}
        className={`
      relative bg-gradient-to-br from-[#445] to-[#334] text-[#eee] p-4 rounded-full 
      transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
      hover:scale-110 hover:brightness-110 active:scale-95
      border-t-[1px] border-l-[1px] border-r-[2px] border-b-[2px] border-[#556]
      shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]
      group
      ${isRolling ? 'opacity-70 cursor-not-allowed animate-pulse' : ''}
    `}
      >
        {diceComponents[currentDice]}
      </button>
      <p className={`
  mt-4 text-3xl font-semibold text-center break-words
  text-[#f8f8f8] drop-shadow-[0_0_8px_rgba(125,211,252,0.3)]
  ${bounce ? 'animate-bounceFinal' : ''}
`}>
        {getMessage()}
      </p>
    </div>
  )
}
