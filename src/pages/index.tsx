import TaskInput from '@/components/TaskInput'
import TaskList from '@/components/TaskList'
import RandomTaskButton from '@/components/RandomTaskButton'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-4 w-full">
      <h1 className="text-3xl font-bold my-6 text-center">Roll My Task 🎲</h1>
      <RandomTaskButton />
      <div className="w-full md:w-3/4 lg:w-1/2">
        <TaskInput />
        <TaskList />
      </div>
    </main>
  )
}
