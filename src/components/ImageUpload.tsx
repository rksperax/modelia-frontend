import { useCallback, useState } from 'react'
import { useDropzone, type DropzoneOptions } from 'react-dropzone'
import { Upload, X } from 'react-feather'
import { validateImageFile, resizeImageIfNeeded } from '../utils/imageUtils'
import { toast } from 'react-toastify'
import { imageResizedMessage } from '../constants/toastMessage'
import { unknownError } from '../constants/validationError'

interface ImageUploadProps {
  onImageSelect: (dataUrl: string) => void
  currentImage: string | null
  disabled?: boolean
}

export function ImageUpload({
  onImageSelect,
  currentImage,
  disabled = false,
}: ImageUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const processFile = useCallback(
    async (file: File) => {
      const validationError = validateImageFile(file)
      if (validationError) {
        toast.error(validationError)
        return
      }

      setIsProcessing(true)
      try {
        const result = await resizeImageIfNeeded(file)
        onImageSelect(result.dataUrl)

        if (result.wasResized) {
          toast.info(imageResizedMessage)
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : unknownError)
      } finally {
        setIsProcessing(false)
      }
    },
    [onImageSelect]
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        void processFile(acceptedFiles[0])
      }
    },
    [processFile]
  )

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    multiple: false,
    disabled: disabled || isProcessing,
  }

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone(dropzoneOptions)

  const handleRemoveImage = useCallback(() => {
    onImageSelect('')
  }, [onImageSelect])

  return (
    <div className="w-full">
      <label
        className="block text-sm font-medium text-gray-700 mb-2"
        htmlFor="image-upload"
      >
        Upload Image
      </label>

      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt="Uploaded preview"
            className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={disabled}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
        relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
        ${
          isDragActive
            ? 'border-primary'
            : 'border-input-border hover:border-accent'
        }
        ${
          disabled || isProcessing
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer hover:bg-accent'
        }
      `}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-4">
            {isProcessing ? (
              <>
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Processing image...
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-lg bg-primary p-3">
                  <Upload className="w-full h-full text-black" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {isDragActive ? 'Drop your image here' : 'Upload an image'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Drag & drop or click to browse • PNG, JPG up to 10MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
