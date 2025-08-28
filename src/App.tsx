import { useState } from 'react'
import { ToastContainer } from "react-toastify"
import { ImageUpload } from './components/ImageUpload'
import { PromptField } from './components/PromptField'
import { StyleDropDown } from './components/StyleDropDown'
import { Preview } from './components/Preview'
import './App.css'

function App() {
  const [image, setImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState<string>('')
  const [style, setStyle] = useState<string>('editorial')

  return (
    <div className="min-h-screen bg-gray-100 w-full p-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-purple-600">AI Studio</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:justify-center gap-4">
        <div className="flex flex-col gap-3">
          <ImageUpload
            currentImage={image}
            onImageSelect={(dataUrl) => {
              setImage(dataUrl)
            }}
          />
          <PromptField
            value={prompt}
            onChange={(value) => {
              setPrompt(value)
            }}
          />
          <StyleDropDown
            value={style}
            onChange={(value) => {
              setStyle(value)
            }}
          />
        </div>
        <Preview image={image} prompt={prompt} style={style} />
        <div>
          <div className="p-6 bg-white rounded-lg shadow-lg w-80 h-80 flex items-center justify-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Component 3
            </h2>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  )
}

export default App
