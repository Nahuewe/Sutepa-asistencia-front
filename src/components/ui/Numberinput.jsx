import React from 'react'
import 'cleave.js/dist/addons/cleave-phone.us'

const NumberInput = ({
  label,
  placeholder = 'Add placeholder',
  className = '',
  register,
  name,
  error,
  id,
  onChange,
  defaultValue,
  ...rest
}) => {
  return (
    <div className={`fromGroup  ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={id} className='block capitalize form-label'>
          {label}
        </label>
      )}
      <div className='relative'>
        <input
          type='text'
          {...rest}
          className={`form-control py-2 ${error ? 'has-error' : ''} ${className} dark:text-white dark:placeholder-white placeholder-black-900`}
          placeholder={placeholder}
          id={id}
          onChange={onChange}
        />
      </div>
      {/* error message */}
      {error && (
        <div className='mt-2 text-danger-500 text-sm'>
          {error.message}
        </div>
      )}
    </div>
  )
}

export default NumberInput
