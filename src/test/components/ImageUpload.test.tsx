import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ImageUpload } from '../../components/ImageUpload'
import * as imageUtils from '../../utils/imageUtils'
import { toast } from 'react-toastify'
import { imageResizedMessage } from '../../constants/toastMessage'

// Mock toast
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}))

describe('ImageUpload Component', () => {
  const mockOnImageSelect = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders upload area when no current image', () => {
    render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={null} />)
    expect(screen.getByText(/Upload Image/i)).toBeInTheDocument()
    expect(screen.getByText(/Upload an image/i)).toBeInTheDocument()
    expect(screen.getByText(/Drag & drop or click to browse/i)).toBeInTheDocument()
  })

  it('renders preview when currentImage is provided', () => {
    render(
      <ImageUpload onImageSelect={mockOnImageSelect} currentImage="https://example.com/test.jpg" />
    )
    expect(screen.getByAltText('Uploaded preview')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Remove image/i })).toBeInTheDocument()
  })

  it('calls onImageSelect after dropping a valid file', async () => {
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })
    const resizedResult = { dataUrl: 'data:image/png;base64,test', wasResized: false }

    vi.spyOn(imageUtils, 'validateImageFile').mockReturnValue(null)
    vi.spyOn(imageUtils, 'resizeImageIfNeeded').mockResolvedValue(resizedResult)

    render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={null} />)

    const input = screen.getByTestId('file-input') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })

    expect(imageUtils.validateImageFile).toHaveBeenCalledWith(file)
    expect(imageUtils.resizeImageIfNeeded).toHaveBeenCalledWith(file)
    expect(mockOnImageSelect).toHaveBeenCalledWith(resizedResult.dataUrl)
  })

  it('shows toast.error if validation fails', async () => {
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })
    const errorMsg = 'Invalid file type'
    vi.spyOn(imageUtils, 'validateImageFile').mockReturnValue(errorMsg)

    render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={null} />)

    const input = screen.getByTestId('file-input') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })

    expect(toast.error).toHaveBeenCalledWith(errorMsg)
    expect(mockOnImageSelect).not.toHaveBeenCalled()
  })

  it('shows toast.info if image was resized', async () => {
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })
    const resizedResult = {
      dataUrl: 'data:image/png;base64,test',
      wasResized: true,
      originalSize: { width: 2000, height: 1500 },
      newSize: { width: 800, height: 700 },
    }

    vi.spyOn(imageUtils, 'validateImageFile').mockReturnValue(null)
    vi.spyOn(imageUtils, 'resizeImageIfNeeded').mockResolvedValue(resizedResult)

    render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={null} />)

    const input = screen.getByTestId('file-input') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })

    expect(toast.info).toHaveBeenCalledWith(imageResizedMessage)
    expect(mockOnImageSelect).toHaveBeenCalledWith(resizedResult.dataUrl)
  })

  it('handles errors thrown by resizeImageIfNeeded', async () => {
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })
    vi.spyOn(imageUtils, 'validateImageFile').mockReturnValue(null)
    vi.spyOn(imageUtils, 'resizeImageIfNeeded').mockRejectedValue(new Error('Resize failed'))

    render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={null} />)

    const input = screen.getByTestId('file-input') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })

    expect(toast.error).toHaveBeenCalledWith('Resize failed')
    expect(mockOnImageSelect).not.toHaveBeenCalled()
  })

  it('calls onImageSelect with empty string when remove button clicked', () => {
    render(
      <ImageUpload onImageSelect={mockOnImageSelect} currentImage="https://example.com/test.jpg" />
    )
    const removeButton = screen.getByRole('button', { name: /Remove image/i })
    fireEvent.click(removeButton)
    expect(mockOnImageSelect).toHaveBeenCalledWith('')
  })
})
