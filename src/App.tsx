import { useCallback, useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { ImageUpload } from './components/ImageUpload'
import { PromptField } from './components/PromptField'
import { StyleDropDown } from './components/StyleDropDown'
import { Preview } from './components/Preview'
import { toast } from 'react-toastify'
import { retryWithBackoff } from './utils/common'
import { generate } from './services/mockApi'
import { GenerateButton } from './components/GenerateButton'
import { clearHistory, getHistory, saveToHistory } from './utils/storageUtils'
import { History } from './components/History'
import type { Generation } from './types'
import {
  generationAbortMessage,
  generationErrorMessage,
  generationSuccessMessage,
  generationValidationFailedMessage,
} from './constants/toastMessage'
import {
  generationAbortedByUser,
  unknownError,
} from './constants/validationError'
import './App.css'

function App() {
  const [image, setImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState<string>('')
  const [style, setStyle] = useState<string>('editorial')

  const [history, setHistory] = useState<Generation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [abortController, setAbortController] =
    useState<AbortController | null>(null)

  const handleGenerate = async () => {
    if (!image || !prompt.trim()) {
      toast.error(generationValidationFailedMessage)
      return
    }

    const abortController = new AbortController()

    setLoading(true)
    setError(null)
    setAbortController(abortController)

    try {
      const generation = await retryWithBackoff(
        () =>
          generate(
            {
              imageDataUrl: image,
              prompt: prompt.trim(),
              style: style,
            },
            abortController.signal
          ),
        3,
        1000
      )

      // Save to history
      saveToHistory(generation)
      setHistory(getHistory())

      // Update state
      setLoading(false)
      setAbortController(null)
      setError(null)
      // Update preview with generated result
      setImage(generation.imageUrl)
      setPrompt(generation.prompt)
      setStyle(generation.style)

      toast.success(generationSuccessMessage)
    } catch (error) {
      if (error instanceof Error && error.message === 'Request aborted') {
        toast.error(generationAbortMessage)
      } else {
        const errorMessage =
          error instanceof Error ? error.message : unknownError
        setError(`Generation failed: ${errorMessage}`)

        toast.error(generationErrorMessage)
      }
    } finally {
      setLoading(false)
      setAbortController(null)
    }
  }

  const handleAbort = useCallback(() => {
    if (abortController) {
      abortController.abort()
      setLoading(false)
      setAbortController(null)
      setError(generationAbortedByUser)
    }
  }, [abortController])

  const handleSelectHistoryItem = (item: Generation) => {
    setImage(item.imageUrl)
    setPrompt(item.prompt)
    setStyle(item.style)
    setError(null)
  }

  const handleClearHistory = () => {
    clearHistory()
    setHistory([])
  }

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const canGenerate = Boolean(image && prompt.trim() && !loading)

  return (
    <div className="min-h-screen bg-gray-100 w-full p-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600">AI Image Studio</h1>
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
          <GenerateButton
            canGenerate={canGenerate}
            isLoading={loading}
            onGenerate={() => void handleGenerate()}
            onAbort={handleAbort}
            error={error}
          />
        </div>
        <Preview image={image} prompt={prompt} style={style} />
        <History
          history={history}
          onSelectItem={handleSelectHistoryItem}
          onClearHistory={handleClearHistory}
        />
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
