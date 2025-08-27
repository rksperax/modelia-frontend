import { useState } from 'react'
import { ToastContainer } from "react-toastify";
import './App.css'
import { ImageUpload } from './components/ImageUpload';

function App() {
  const [image, setImage] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-100 w-full p-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-purple-600">AI Studio</h1>
      </header>
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-center lg:gap-4">
        <div>
          <ImageUpload
            currentImage={image}
            onImageSelect={(dataUrl) => {
              setImage(dataUrl)
            }}
          />
        </div>
        <div>
          <div className="p-6 bg-white rounded-lg shadow-lg w-80 h-80 flex items-center justify-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Component 2
            </h2>
          </div>
        </div>
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
