import { styleDropDownOptions } from '../constants/common'

interface StyleDropDownProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function StyleDropDown({
  value,
  onChange,
  disabled = false,
}: StyleDropDownProps) {
  return (
    <div className="w-full">
      <label
        htmlFor="style-dropdown"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Style
      </label>
      <select
        id="style-dropdown"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        disabled={disabled}
        className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg  transition-all duration-200 appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        aria-describedby="style-help"
      >
        {styleDropDownOptions.map((style) => (
          <option key={style.value} value={style.value}>
            {style.label}
          </option>
        ))}
      </select>
    </div>
  )
}
