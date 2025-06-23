import TaskInput from '@/components/TaskInput'
import TaskList from '@/components/TaskList'
import RandomTaskButton from '@/components/RandomTaskButton'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="w-full bg-[#445] py-4 mb-6 shadow-[0_10px_15px_-5px_rgba(17,17,34,0.7)] bg-[linear-gradient(to_right,_#334,_#445,_#334,_#445,#334)]">
          <h1 className="text-3xl font-semibold text-center text-[#efefef]">Roll My Task 🎲</h1>
        </div>
        <div className="w-full px-6 md:w-3/4 lg:w-1/2 mx-auto pb-8">
          <RandomTaskButton />
          <TaskInput />
          <TaskList />
        </div>
      </main>
      <Footer />
    </div>
  )
}