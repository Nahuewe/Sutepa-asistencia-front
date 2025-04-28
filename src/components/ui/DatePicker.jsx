/* eslint-disable no-return-assign */
import React from 'react'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_blue.css'

const flatpickrOptions = {
  dateFormat: 'd/m/Y',
  allowInput: true,
  enableTime: false,
  locale: {
    firstDayOfWeek: 1,
    weekdays: {
      shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    },
    months: {
      shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    }
  }
}

const formatDateInput = (value) => {
  const cleaned = value.replace(/\D+/g, '')
  const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/)
  if (match) {
    const [, day, month, year] = match
    return `${day}${day.length === 2 && month ? '/' : ''}${month}${month.length === 2 && year ? '/' : ''}${year}`
  }
  return value
}

const DatePicker = ({ value, onChange, id, placeholder, disabled }) => {
  let flatpickrRef = null

  const handleInput = (e) => {
    const formattedValue = formatDateInput(e.target.value)
    e.target.value = formattedValue
  }

  const handleBlur = () => {
    const inputValue = flatpickrRef && flatpickrRef.flatpickr.input.value
    if (inputValue) {
      const date = flatpickrRef.flatpickr.parseDate(inputValue, 'd/m/Y')
      if (date) {
        onChange([date])
      } else {
        onChange([null])
      }
    }
  }

  return (
    <Flatpickr
      options={flatpickrOptions}
      className='form-control py-2 flatPickrBG dark:flatPickrBGDark dark:placeholder-white placeholder-black-500'
      value={value}
      id={id}
      maxLength={10}
      placeholder={placeholder}
      onChange={(dates) => {
        onChange(dates)
        flatpickrRef.flatpickr.close()
      }}
      disabled={disabled}
      onFocus={() => flatpickrRef.flatpickr.open()}
      onBlur={handleBlur}
      ref={ref => flatpickrRef = ref}
      onInput={handleInput}
    />
  )
}

export default DatePicker
