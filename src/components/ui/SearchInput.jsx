import Cleave from 'cleave.js/react'
import { useState } from 'react'
import Icon from '@/components/ui/Icon'
import 'cleave.js/dist/addons/cleave-phone.us'

const SearchInput = ({
  type,
  label,
  placeholder = 'Add placeholder',
  classLabel = '',
  className = '',
  classGroup = '',
  register,
  name,
  readonly,
  value,
  error,
  icon,
  disabled,
  id,
  horizontal,
  validate,
  isMask,
  msgTooltip,
  description,
  hasicon,
  onChange,
  options,
  onFocus,
  defaultValue,
  ...rest
}) => {
  const [open, setOpen] = useState(false)

  const toggleVisibility = () => setOpen(prev => !prev)

  const inputBaseStyles = `
  block w-full px-4 py-2 border rounded-xl shadow-sm transition
  placeholder-black-500 focus:ring-2 focus:outline-none
  focus:ring-primary-500 disabled:bg-gray-100
  dark:placeholder-white dark:bg-gray-800 dark:border-gray-600
  dark:text-white
  `

  const borderColor = error
    ? 'border-red-500 focus:ring-red-500'
    : validate
      ? 'border-green-500 focus:ring-green-500'
      : 'border-gray-300 focus:border-primary-500'

  return (
    <div className={`formGroup ${horizontal ? 'flex items-start' : ''} ${error ? 'has-error' : ''} ${validate ? 'is-valid' : ''}`}>
      {label && (
        <label
          htmlFor={id}
          className={`capitalize mb-1 font-medium ${horizontal ? 'w-[120px] mr-4' : 'block'} ${classLabel}`}
        >
          {label}
        </label>
      )}

      <div className={`relative ${horizontal ? 'flex-1' : ''}`}>
        {!isMask && (
          <input
            type={type === 'password' && open ? 'text' : type}
            {...(name ? { name } : {})}
            {...rest}
            className={`${inputBaseStyles} ${borderColor} ${className}`}
            placeholder={placeholder}
            readOnly={readonly}
            defaultValue={defaultValue}
            disabled={disabled}
            id={id}
            onChange={onChange}
            autoComplete={type === 'password' ? 'new-password' : 'off'}
          />
        )}

        {isMask && (
          <Cleave
            {...rest}
            options={options}
            placeholder={placeholder}
            className={`${inputBaseStyles} ${borderColor} ${className}`}
            onFocus={onFocus}
            id={id}
            readOnly={readonly}
            disabled={disabled}
            onChange={onChange}
          />
        )}

        <div className='flex text-xl absolute top-1/2 right-3 -translate-y-1/2 space-x-2'>
          {hasicon && type === 'password' && (
            <button
              type='button'
              onClick={toggleVisibility}
              className='text-secondary-500 focus:outline-none'
            >
              <Icon icon={open ? 'heroicons-outline:eye' : 'heroicons-outline:eye-off'} />
            </button>
          )}

          {error && (
            <span className='text-red-500'>
              <Icon icon='heroicons-outline:information-circle' />
            </span>
          )}
          {validate && (
            <span className='text-green-500'>
              <Icon icon='bi:check-lg' />
            </span>
          )}
        </div>
      </div>

      {error && (
        <div
          className={`mt-2 ${
            msgTooltip
              ? 'inline-block bg-red-500 text-white text-xs px-2 py-1 rounded'
              : 'text-red-500 text-sm'
          }`}
        >
          {error.message}
        </div>
      )}

      {validate && !error && (
        <div
          className={`mt-2 ${
            msgTooltip
              ? 'inline-block bg-green-500 text-white text-xs px-2 py-1 rounded'
              : 'text-green-600 text-sm'
          }`}
        >
          {validate}
        </div>
      )}

      {description && (
        <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>{description}</p>
      )}
    </div>
  )
}

export default SearchInput
