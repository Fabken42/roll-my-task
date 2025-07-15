'use client'
import { useTaskStore } from '@/store/useTaskStore'
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export default function RandomTaskButton({ onTaskSelected }: { onTaskSelected: () => void }) {
  const setTriggerBounceId = useTaskStore((s) => s.setTriggerBounceId)
  const selectRandomTask = useTaskStore((state) => state.selectRandomTask) 
  const isActive = useTaskStore((state) => state.isActive)
  const updateSelectedTaskId = useTaskStore((state) => state.updateSelectedTaskId)
  const tasks = useTaskStore((state) => state.tasks)
  const [isRolling, setIsRolling] = useState(false)
  const [currentDice, setCurrentDice] = useState<1 | 2 | 3 | 4 | 5 | 6>(3) // Começa com o Dice3

  // Sequência de dados: 3 > 5 > 1 > 6 > 2 > 4
  // Modifique a declaração da diceSequence para:
  const diceSequence: Array<1 | 2 | 3 | 4 | 5 | 6> = [3, 5, 1, 6, 2, 4]
  const diceComponents = {
    1: <Dice1 size={42} />,
    2: <Dice2 size={42} />,
    3: <Dice3 size={42} />,
    4: <Dice4 size={42} />,
    5: <Dice5 size={42} />,
    6: <Dice6 size={42} />,
  }

  // Refs para os áudios
  const selectSoundRef = useRef<HTMLAudioElement | null>(null)
  const rollingSoundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    selectSoundRef.current = new Audio('/sounds/task-selected.mp3')
    selectSoundRef.current.volume = 0.5

    rollingSoundRef.current = new Audio('/sounds/dice-rolling.mp3')
    rollingSoundRef.current.loop = true
    rollingSoundRef.current.volume = 0.6

    return () => {
      if (selectSoundRef.current) {
        selectSoundRef.current.pause()
        selectSoundRef.current = null
      }
      if (rollingSoundRef.current) {
        rollingSoundRef.current.pause()
        rollingSoundRef.current = null
      }
    }
  }, [])

  const handleClick = () => {
if (isRolling || isActive || tasks.length === 0) return

    const incompleteTasks = tasks.filter((task) => !task.completed)
    if (incompleteTasks.length === 0) return

    setIsRolling(true)

    if (rollingSoundRef.current) {
      rollingSoundRef.current.currentTime = 0
      rollingSoundRef.current.play().catch((e) => console.error('Erro ao tocar dado:', e))
    }

    let rollCount = 0
    let delay = 100
    const maxRolls = 12

    const roll = () => {
      const nextDiceIndex = rollCount % diceSequence.length
      setCurrentDice(diceSequence[nextDiceIndex])
      const randomTask = incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)]
      updateSelectedTaskId(randomTask.id)
      rollCount++

      if (rollCount < maxRolls) {
        delay *= 1.1
        setTimeout(roll, delay)
      } else {
        const finalTask = selectRandomTask()
        if (rollingSoundRef.current) {
          rollingSoundRef.current.pause()
          rollingSoundRef.current.currentTime = 0
        }
        if (finalTask) { 
          setTriggerBounceId(finalTask.id)
        }

        setIsRolling(false)
        setCurrentDice(3)

        if (selectSoundRef.current) {
          selectSoundRef.current.currentTime = 0
          selectSoundRef.current.play().catch(e => console.error("Falha ao tocar som:", e))
        }

        onTaskSelected()
      }
    }
    roll()
  }

  return (
    <div className="flex flex-col items-center mb-8">
      <button
        onClick={handleClick}
        disabled={isRolling || isActive}
        className={`
      relative bg-gradient-to-br from-[#445] to-[#334] text-[#eee] p-5 rounded-full 
      transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
      hover:scale-110 hover:brightness-110 active:scale-95
      border-t-[1px] border-l-[1px] border-r-[2px] border-b-[2px] border-[#556]
      shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]
      group
      ${isRolling || isActive ? 'opacity-70 cursor-not-allowed animate-pulse' : ''}
    `}
      >
        {diceComponents[currentDice]}
      </button>
    </div>
  )
}
