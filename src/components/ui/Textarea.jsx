import Icon from '@/components/ui/Icon'

const Textarea = ({
  label,
  placeholder,
  classLabel = 'form-label',
  className = '',
  classGroup = '',
  register,
  name,
  readonly,
  dvalue,
  error,
  icon,
  disabled,
  id,
  horizontal,
  validate,
  msgTooltip,
  description,
  cols,
  row = 3,
  onChange,
  ...rest
}) => {
  return (
    <div
      className={`fromGroup  ${error ? 'has-error' : ''}  ${
        horizontal ? 'flex' : ''
      }  ${validate ? 'is-valid' : ''} `}
    >
      {label && (
        <label
          htmlFor={id}
          className={`block capitalize ${classLabel}  ${
            horizontal ? 'flex-0 mr-6 md:w-[100px] w-[60px] break-words' : ''
          }`}
        >
          {label}
        </label>
      )}

      <div className={`relative ${horizontal ? 'flex-1' : ''}`}>
        {name && (
          <textarea
            {...register(name)}
            {...rest}
            className={`${error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} ${error ? 'has-error' : ''} form-control py-2 ${className} dark:text-white dark:placeholder-white placeholder-black-900`}
            placeholder={placeholder}
            readOnly={readonly}
            disabled={disabled}
            id={id}
            cols={cols}
            rows={row}
            onChange={onChange}
          />
        )}

        {!name && (
          <textarea
            className={`${
              error ? ' has-error' : ' '
            } form-control py-2 ${className}  `}
            placeholder={placeholder}
            readOnly={readonly}
            disabled={disabled}
            id={id}
            cols={cols}
            rows={row}
            onChange={onChange}
          />
        )}

        <div className='flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2  space-x-1 rtl:space-x-reverse'>
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
          className={` mt-2 ${
            msgTooltip
              ? ' inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded'
              : ' text-danger-500 block text-sm'
          }`}
        >
          {error.message}
        </div>
      )}

      {validate && (
        <div
          className={` mt-2 ${
            msgTooltip
              ? ' inline-block bg-success-500 text-white text-[10px] px-2 py-1 rounded'
              : ' text-success-500 block text-sm'
          }`}
        >
          {validate}
        </div>
      )}

      {description && <span className='input-description'>{description}</span>}
    </div>
  )
}

export default Textarea
