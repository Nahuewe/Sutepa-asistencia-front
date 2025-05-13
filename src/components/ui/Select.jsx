import { Fragment } from 'react'
import Icon from '@/components/ui/Icon'

const Select = ({
  label,
  placeholder = 'Selecciona una opción',
  classLabel = 'form-label',
  className = '',
  classGroup = '',
  register,
  name,
  readonly,
  error,
  icon,
  disabled,
  id,
  horizontal,
  validate,
  msgTooltip,
  description,
  onChange,
  options,
  size,
  ...rest
}) => {
  options = options || Array(3).fill('option')

  return (
    <div className={`formGroup ${error ? 'has-error' : ''} ${horizontal ? 'flex' : ''} ${validate ? 'is-valid' : ''}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block capitalize ${classLabel} ${horizontal ? 'flex-0 mr-6 md:w-[100px] w-[60px] break-words' : ''}`}
        >
          {label}
        </label>
      )}
      <div className={`relative ${horizontal ? 'flex-1' : ''}`}>
        {name && (
          <select
            onChange={onChange}
            {...register(name)}
            {...rest}
            className={`${error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} ${error ? 'has-error' : ''} form-control py-2 ${className} dark:text-white dark:placeholder-white placeholder-black-900`}
            readOnly={readonly}
            disabled={disabled}
            id={id}
            size={size}
          >

            <option value='' disabled>
              {placeholder}
            </option>

            {options.map((option, i) => (
              <Fragment key={i}>
                {option.value && option.label
                  ? (
                    <option key={i} value={option.value}>
                      {option.label}
                    </option>
                    )
                  : (
                    <option key={i} value={option}>
                      {option}
                    </option>
                    )}
              </Fragment>
            ))}
          </select>
        )}

        <div className='flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2 space-x-1 rtl:space-x-reverse'>
          <span className=' relative -right-2 inline-block text-slate-900 dark:text-slate-300 pointer-events-none'>
            <Icon icon='heroicons:chevron-down' />
          </span>
          {error && (
            <span className='text-danger-500'>
              <Icon icon='heroicons-outline:information-circle' />
            </span>
          )}
          {validate && (
            <span className='text-success-500'>
              <Icon icon='bi:check-lg' />
            </span>
          )}
        </div>
      </div>

      {error && (
        <div
          className={` mt-2 ${msgTooltip ? ' inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded' : ' text-danger-500 block text-sm'}`}
        >
          {error.message}
        </div>
      )}

      {validate && (
        <div
          className={` mt-2 ${msgTooltip ? ' inline-block bg-success-500 text-white text-[10px] px-2 py-1 rounded' : ' text-success-500 block text-sm'}`}
        >
          {validate}
        </div>
      )}

      {description && <span className='input-description'>{description}</span>}
    </div>
  )
}

export default Select
