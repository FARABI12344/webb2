import React, { useEffect, useState } from 'react'
import ImageGen from './components/ImageGen'

const App = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    const handleClick = e => {
      const ripple = document.createElement('span')
      ripple.className = 'ripple'
      ripple.style.left = `${e.clientX}px`
      ripple.style.top = `${e.clientY}px`
      document.body.appendChild(ripple)
      setTimeout(() => ripple.remove(), 600)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="min-h-screen px-4 py-6 shake">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-extrabold transition-colors"
            style={{
              color: darkMode ? 'white' : 'black',
              textShadow: darkMode ? '0 0 5px black' : 'none'
            }}>
          AKR IMAGE GEN
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-sm"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <a
            href="https://about.farabi.me"
            target="_blank"
            className="underline text-blue-500 font-bold"
            rel="noopener noreferrer"
          >
            MADE BY FARABI
          </a>
        </div>
      </div>
      <ImageGen />
    </div>
  )
}

export default App
