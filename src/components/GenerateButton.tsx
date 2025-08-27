import { Loader, Zap, StopCircle } from 'react-feather'

interface GenerateButtonProps {
  onGenerate: () => void
  onAbort: () => void
  isLoading: boolean
  canGenerate: boolean
  error: string | null
}

export function GenerateButton({
  onGenerate,
  onAbort,
  isLoading,
  canGenerate,
  error,
}: GenerateButtonProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-4">
        {/* Error Display */}
        {error && (
          <div className="p-3 rounded-lg bg-red-100 border border-red-200 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Generation Button */}
        <div className="flex gap-2">
          {isLoading ? (
            <button
              type="button"
              onClick={onAbort}
              className="flex-1 bg-yellow-300 text-white rounded-full py-3 px-6cursor-pointer flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors"
              aria-label="Abort generation"
            >
              <StopCircle className="w-4 h-4" />
              Abort
            </button>
          ) : (
            <button
              type="button"
              onClick={onGenerate}
              disabled={!canGenerate}
              className="flex-1 bg-green-400 text-white rounded-full py-3 px-6 cursor-pointer flex items-center justify-center gap-2 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Generate AI image"
            >
              <Zap className="w-4 h-4" />
              Generate
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Generating your image...</span>
          </div>
        )}

        {/* Status Info */}
        <div className="text-xs text-muted-foreground text-center">
          {!canGenerate &&
            !isLoading &&
            'Upload an image and enter a prompt to generate'}
          {canGenerate &&
            !isLoading &&
            'Ready to generate • This may take a few seconds'}
        </div>
      </div>
    </div>
  )
}
