interface PromptFieldProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function PromptField({
  value,
  onChange,
  disabled = false,
}: PromptFieldProps) {
  return (
    <div className="w-full">
      <label
        htmlFor="prompt-input"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Prompt
      </label>
      <textarea
        id="prompt-input"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        disabled={disabled}
        placeholder="Describe the image you want to generate..."
        className="w-full pl-3 pr-4 py-3 border border-gray-300 bg-white rounded-lg focus:border-transparent transition-all duration-200 h-24 disabled:opacity-50 disabled:cursor-not-allowed"
        rows={4}
        maxLength={500}
        aria-describedby="prompt-help"
      />
      <div className="flex justify-between items-center mt-1">
        <span className="text-sm text-gray-400">{value.length}/500</span>
      </div>
    </div>
  )
}
