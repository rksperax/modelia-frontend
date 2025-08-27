import { maxImageSizeBytes } from '../constants/common';
import { imageTypeRegex } from '../constants/regex';
import {
  canvasContextNotAvailable,
  imageLoadError,
  imageReadError,
  imageSizeValidationError,
  imageTypeValidationError,
} from '../constants/validationError'

export interface ImageProcessingResult {
  dataUrl: string
  wasResized: boolean
  originalSize: { width: number; height: number }
  newSize: { width: number; height: number }
}

export function validateImageFile(file: File): string | null {
  // Check file type
  if (!imageTypeRegex.exec(file.type)) {
    return imageTypeValidationError
  }

  // Check file size (10MB)
  if (file.size > maxImageSizeBytes) {
    return imageSizeValidationError
  }

  return null
}

export function resizeImageIfNeeded(
  file: File,
  maxDimension = 1920
): Promise<ImageProcessingResult> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error(canvasContextNotAvailable))
      return
    }

    img.onload = () => {
      const originalWidth = img.width
      const originalHeight = img.height

      // Check if resizing is needed
      const needsResize =
        originalWidth > maxDimension || originalHeight > maxDimension

      let newWidth = originalWidth
      let newHeight = originalHeight

      if (needsResize) {
        // Calculate new dimensions maintaining aspect ratio
        if (originalWidth > originalHeight) {
          newWidth = maxDimension
          newHeight = (originalHeight * maxDimension) / originalWidth
        } else {
          newHeight = maxDimension
          newWidth = (originalWidth * maxDimension) / originalHeight
        }
      }

      // Set canvas dimensions
      canvas.width = newWidth
      canvas.height = newHeight

      // Draw and resize image
      ctx.drawImage(img, 0, 0, newWidth, newHeight)

      // Get data URL
      const dataUrl = canvas.toDataURL(file.type, 0.9)

      resolve({
        dataUrl,
        wasResized: needsResize,
        originalSize: { width: originalWidth, height: originalHeight },
        newSize: { width: newWidth, height: newHeight },
      })
    }

    img.onerror = () => {
      reject(new Error(imageLoadError))
    }

    // Convert file to data URL for the image element
    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.onerror = () => {
      reject(new Error(imageReadError))
    }
    reader.readAsDataURL(file)
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(2)).toString() + ' ' + sizes[i]
  )
}
