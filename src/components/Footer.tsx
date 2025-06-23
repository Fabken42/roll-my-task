import { Github, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
     <footer className="w-full bg-[#445] mt-8 py-4 text-[#eee] text-center text-sm shadow-[0_-10px_15px_-5px_rgba(17,17,34,0.7)] bg-[linear-gradient(to_right,_#334,_#445,_#334,_#445,#334)]">
        <div className="mb-2">
          <p className='text-[1.1em]'>Email: <a href="mailto:fabken42@gmail.com" className="underline hover:text-blue-300">fabken42@gmail.com</a></p>
          <p className='text-[1.1em]'>Telefone: (11) 95381-8106</p>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          <a
            href="https://github.com/Fabken42"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition"
          >
            <Github size={26} />
          </a>
          <a
            href="https://www.linkedin.com/in/fabr%C3%ADcio-kohatsu-7486a9279/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition"
          >
            <Linkedin size={26} />
          </a>
        </div>
      </footer>
  )
}
