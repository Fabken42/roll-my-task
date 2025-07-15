'use client'
import { useState, useEffect, useRef } from 'react'
import { Settings, AlarmClock, Play, Pause, TimerReset } from 'lucide-react'
import Swal from 'sweetalert2'
import { useTaskStore } from '@/store/useTaskStore'

const alarmSounds = [
    { id: 'digital', name: 'Digital', file: '/sounds/alarm-digital.mp3' },
    { id: 'bell', name: 'Sino', file: '/sounds/alarm-bell.mp3' },
    { id: 'beep', name: 'Bip', file: '/sounds/alarm-beep.mp3' },
    { id: 'elevator', name: 'Elevador', file: '/sounds/alarm-elevator.mp3' },
]

interface TimerProps {
    startTimerFlag: boolean;
    setStartTimerFlag: (value: boolean) => void;
}

export default function Timer({ startTimerFlag, setStartTimerFlag }: TimerProps) {

    const completeSelectedTask = useTaskStore((state) => state.completeSelectedTask)
    const selectedTaskId = useTaskStore((state) => state.selectedTaskId)
    const triggerBounceId = useTaskStore((state) => state.triggerBounceId)
    const tasks = useTaskStore((state) => state.tasks)
    const { isActive, setIsActive } = useTaskStore();
    const [bounce, setBounce] = useState(false)
    const [minutes, setMinutes] = useState<number>(25)
    const [autoStart, setAutoStart] = useState<boolean>(true)
    const [selectedSound, setSelectedSound] = useState<string>('digital')
    const [timeLeft, setTimeLeft] = useState<number>(25 * 60)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const clickSoundRef = useRef<HTMLAudioElement | null>(null)
    const progress = timeLeft / (minutes * 60)
    useEffect(() => {
        return () => {
            if ((window as any).playSoundPreview) {
                delete (window as any).playSoundPreview
            }
        }
    }, [])

    useEffect(() => {
        const savedSettings = localStorage.getItem('timerSettings')
        if (savedSettings) {
            const { minutes, autoStart, sound } = JSON.parse(savedSettings)
            setMinutes(minutes)
            setAutoStart(autoStart)
            setSelectedSound(sound)
            setTimeLeft(Math.round(minutes * 60))
        }
    }, [])

    useEffect(() => {
        clickSoundRef.current = new Audio('/sounds/button-click.mp3')
        clickSoundRef.current.volume = 0.5
    }, [])


    useEffect(() => {
        if (isActive) {
            document.title = `⏳ ${formatTime()} - ${getTaskMessage()}`
        } else {
            document.title = 'Roll My Task'
        }
    }, [timeLeft, isActive])

    useEffect(() => {
        if (!triggerBounceId) return;

        const task = tasks.find((t) => t.id === triggerBounceId);
        if (!task) return;

        setBounce(true);
        resetTimer();

        const timer = setTimeout(() => setBounce(false), 1000);

        return () => clearTimeout(timer);
    }, [triggerBounceId, tasks]);


    const getTaskMessage = () => {
        const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

        if (selectedTaskId === null) return 'Nenhuma tarefa selecionada!'

        const task = tasks.find(t => t.id === selectedTaskId)
        if (!task) return 'Nenhuma tarefa pendente!'

        return capitalize(task.title)
    }

    // Salvar configurações quando mudarem
    useEffect(() => {
        const settings = { minutes, autoStart, sound: selectedSound }
        localStorage.setItem('timerSettings', JSON.stringify(settings))
    }, [minutes, autoStart, selectedSound])

    // Efeito para iniciar o timer automaticamente
    useEffect(() => {
        if (startTimerFlag && autoStart && !isActive) {
            startTimerHandler();
            setStartTimerFlag(false)
        }
    }, [startTimerFlag, autoStart, isActive])

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        let endTime: number

        if (isActive) {
            const now = Date.now()
            endTime = now + timeLeft * 1000

            interval = setInterval(() => {
                const secondsLeft = Math.max(0, Math.round((endTime - Date.now()) / 1000))
                setTimeLeft(secondsLeft)

                if (secondsLeft <= 0) {
                    clearInterval(interval!)
                    playAlarmSound()
                    setIsActive(false)
                    completeSelectedTask()
                    Swal.fire({
                        title: 'Tempo Esgotado!',
                        text: `Você terminou de ${getTaskMessage()}`,
                        icon: 'info',
                        background: '#445',
                        color: '#eee',
                        timer: 3000,
                    })
                }
            }, 250)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isActive])


    const playSoundPreview = (soundId: string) => {
        const sound = alarmSounds.find(s => s.id === soundId)
        if (sound) {
            const previewAudio = new Audio(sound.file)
            previewAudio.volume = 0.7
            previewAudio.play().catch(e => console.error("Erro ao tocar prévia:", e))
        }
    }

    const playClickSound = () => {
        if (clickSoundRef.current) {
            clickSoundRef.current.volume = 0.5
            clickSoundRef.current.currentTime = 0
            clickSoundRef.current.play().catch(() => { })
        }
    }

    const startTimerHandler = () => {
        setIsActive(true)
    }

    const pauseTimer = () => {
        setIsActive(false)
    }

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(Math.round(minutes * 60))
    }

    const formatTime = () => {
        const hours = Math.floor(timeLeft / 3600)
        const mins = Math.floor((timeLeft % 3600) / 60)
        const secs = timeLeft % 60

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        } else {
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
    }

    const playAlarmSound = () => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }

        const sound = alarmSounds.find(s => s.id === selectedSound)
        if (sound) {
            audioRef.current = new Audio(sound.file)
            audioRef.current.volume = 0.7
            audioRef.current.play().catch(e => console.error("Erro ao tocar som:", e))
        }
    }

const openSettings = () => {
    Swal.fire({
        title: 'Configurações do Timer',
        html: `
      <div class="text-left text-[#eee] space-y-6 px-2 text-sm">
        <div>
          <label class="block mb-2 text-[1.2em] tracking-wide">Duração (minutos):</label>
          <input 
            type="number" 
            id="swal-minutes" 
            class="swal2-input bg-[#445] text-[#eee] border border-[#556] focus:ring-[#778] focus:border-[#778] rounded w-full placeholder-[#bbb]"
            min="0.1" 
            max="1000"
            step="1" 
            value="${minutes}"
            placeholder="Digite a duração"
          >
        </div>
        <div class="pt-2">
          <label class="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="swal-autostart" 
              class="form-checkbox rounded text-[#556] focus:ring-[#778] scale-125" 
              ${autoStart ? 'checked' : ''}
            >
            <span class="text-sm text-[1.2em]">Iniciar automaticamente após sortear tarefa</span>
          </label>
        </div>
        <div>
          <label class="block mb-2 tracking-wide text-[1.2em] ">Som do alarme:</label>
          <div class="flex items-center gap-3">
            <select 
              id="swal-sound" 
              class="swal2-select bg-[#445] text-[#eee] w-full border border-[#556] focus:ring-2 focus:ring-[#778] rounded"
            >
              ${alarmSounds.map(sound => `
                <option 
                  value="${sound.id}" 
                  ${selectedSound === sound.id ? 'selected' : ''}
                  class="text-[1.2em] bg-[#334] hover:bg-[#445]"
                >
                  ${sound.name}
                </option>
              `).join('')}
            </select>
            <button
              type="button"
              id="swal-preview-btn"
              class="bg-[#556] hover:bg-[#667] text-white px-3 py-1.5 rounded text-sm flex items-center justify-center shadow-sm border border-[#667]"
              title="Ouvir Som"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.5 3.5v9l7-4.5-7-4.5z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `,
        background: '#334',
        color: '#eee',
        width: '80%',
        padding: '1.5rem',
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        customClass: {
            popup: 'rounded-xl border border-[#445] md:w-3/4 lg:w-1/2 max-w-3xl shadow-xl',
            confirmButton: 'bg-[#445] hover:bg-[#556] text-white px-4 py-2 rounded mr-2 transition-all',
            cancelButton: 'bg-[#445] hover:bg-[#556] text-white px-4 py-2 rounded transition-all',
            // Remova a propriedade 'select' que não existe
            input: 'text-[#eee]'
        },
        didOpen: () => {
            const previewBtn = document.getElementById('swal-preview-btn');
            const selectEl = document.getElementById('swal-sound') as HTMLSelectElement;
            previewBtn?.addEventListener('click', () => {
                const value = selectEl?.value;
                playSoundPreview(value);
            });
        },
        preConfirm: () => {
            const minsInput = document.getElementById('swal-minutes') as HTMLInputElement;
            const autoStartInput = document.getElementById('swal-autostart') as HTMLInputElement;
            const soundInput = document.getElementById('swal-sound') as HTMLSelectElement;

            const mins = parseFloat(minsInput.value) || 25;
            const autoStart = autoStartInput.checked;
            const sound = soundInput.value;

            if (mins < 0.1 || mins > 1000) {
                Swal.showValidationMessage('Digite um valor entre 1 e 1000 minutos');
                return false;
            }

            return { mins, autoStart, sound };
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            const { mins, autoStart, sound } = result.value;
            setMinutes(mins);
            setAutoStart(autoStart);
            setSelectedSound(sound);
            setTimeLeft(Math.round(mins * 60));

            if (isActive) {
                setIsActive(false);
                setTimeout(() => setIsActive(true), 100);
            }
        }
    });
};

    return (
        <div
            className="relative mb-8 p-[3px] rounded-lg"
            style={{
                background: `conic-gradient(from 0deg, #334 ${360 - progress * 360}deg, #4ade80 0deg)`
            }}
        >
            <div className="bg-[#334] p-6 rounded-lg shadow-lg border border-[#445] w-full h-full ">
                {/* Conteúdo atual do timer (mantido igual) */}
                <div className="mb-3 flex justify-between items-center">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-[#eee]">
                        <AlarmClock size={24} /> Timer
                    </h2>
                    <button
                        onClick={openSettings}
                        className="text-[#eee] hover:text-[#aaa] transition-transform hover:scale-110"
                        aria-label="Configurações do Timer"
                    >
                        <Settings size={20} />
                    </button>
                </div>

                <div className="mb-8 text-center">
                    <p className={
                        `text-4xl font-semibold break-words
                    text-[#f8f8f8] drop-shadow-[0_0_8px_rgba(180,180,252,.2)]
                    ${bounce ? 'animate-bounceFinal' : ''}`
                    }>
                        {getTaskMessage()}
                    </p>
                </div>

                <div className="text-center">
                    <div className="text-5xl font-mono font-semibold mb-10 text-[#f8f8f8] drop-shadow-[0_0_8px_rgba(180,180,252,.2)]">
                        {formatTime()}
                    </div>

                    <div className="flex justify-center gap-6 px-2 w-full">
                        {!isActive ? (
                            <button
                                onClick={() => {
                                    playClickSound()
                                    startTimerHandler()
                                }}
                                className="flex-1 bg-[#445] text-white px-6 py-4 rounded-xl 
                              transition-all hover:brightness-110 active:scale-95 shadow-md
                              flex items-center justify-center gap-1"
                            >
                                <Play size={18} className="inline-block ml-1" />
                                <span>Iniciar</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    playClickSound()
                                    pauseTimer()
                                }}
                                className="flex-1 bg-[#445] text-white px-6 py-4 rounded-xl 
                              transition-all hover:brightness-110 active:scale-95 shadow-md
                              flex items-center justify-center gap-1"
                            >
                                <Pause size={18} className="inline-block ml-1" />
                                <span>Pausar</span>
                            </button>
                        )}

                        <button
                            onClick={() => {
                                playClickSound()
                                resetTimer()
                            }}
                            className="flex-1 bg-[#445] text-white px-6 py-4 rounded-xl 
                              transition-all hover:brightness-110 active:scale-95 shadow-md
                              flex items-center justify-center gap-1"
                        >
                            <TimerReset size={18} className="inline-block ml-1" />
                            <span>Resetar</span>
                        </button>
                    </div>
                </div>

                <audio ref={audioRef} className="hidden" />
            </div>
        </div>
    )
}