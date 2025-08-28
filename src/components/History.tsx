import { Trash2 } from 'react-feather'
import { type Generation } from '../types'
import { styleDropDownOptions } from '../constants/common'

interface GenerationHistoryProps {
  history: Generation[]
  onSelectItem: (item: Generation) => void
  onClearHistory: () => void
}

export function History({
  history,
  onSelectItem,
  onClearHistory,
}: GenerationHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getStyleLabel = (styleValue: string) => {
    const style = styleDropDownOptions.find((s) => s.value === styleValue)
    return style?.label ?? styleValue
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Generations
          </h3>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-gray-500 hover:text-red-600 p-2 rounded-md transition-colors duration-200"
            aria-label="Clear history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No generations yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Your recent generations will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                onSelectItem(item)
              }}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
              aria-label={`Select generation: ${item.prompt.slice(0, 50)}${
                item.prompt.length > 50 ? '...' : ''
              }`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-purple-700">
                    {item.prompt}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {getStyleLabel(item.style)}
                    </span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
