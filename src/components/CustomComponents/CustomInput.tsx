import React from 'react'
import { Controller, ControllerRenderProps } from 'react-hook-form'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'

type CustomInputProps = {
  name: string
  placeholder?: string
  control?: any
  errors?: any
  label?: string
  floatLabel?: boolean
  size?: 'large' | 'medium' | 'small'
  className?: string
  type?: 'text' | 'password' | 'number'
  onChange?: (e: any) => void
  disabled?: boolean
  status?: 'error' | 'warning'
}

export const Input: React.FC<CustomInputProps> = ({
  name,
  placeholder,
  control,
  errors,
  label,
  floatLabel = false,
  size = 'large',
  className,
  type = 'text',
  onChange,
  disabled = false,
  status
}) => {
  const isInvalid = status === 'error' || !!errors?.[name]
  const inputClassNames = `py-2 ${className} ${
    {
      small: 'p-inputtext-sm',
      medium: '',
      large: 'p-inputtext-lg'
    }[size]
  } ${isInvalid ? 'p-invalid' : ''}`

  const inputCommonProps = {
    placeholder,
    id: name,
    name,
    onChange,
    disabled,
    invalid: isInvalid
  }
  const inputPtProps = {
    pt: {
      input: {
        root: () => ({
          className: inputClassNames
        })
      }
    }
  }

  const getInputElement = (field?: ControllerRenderProps) => {
    const elementProps = { ...inputCommonProps, ...(field || {}) }
    switch (type) {
      case 'number':
        return <InputNumber {...elementProps} {...inputPtProps} useGrouping={false} />
      case 'password':
        return <Password {...elementProps} {...inputPtProps} feedback={false} />
      case 'text':
      default:
        return <InputText {...inputCommonProps} {...(field || {})} className={inputClassNames} />
    }
  }

  const renderErrorMessage = () => (errors?.[name] ? <div className='p-error'>{errors[name].message}</div> : null)

  return control ? (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          {
            <span className={floatLabel ? 'p-float-label' : undefined}>
              {floatLabel && getInputElement(field)}
              <label htmlFor={name} className={fieldState.invalid ? 'p-error' : ''}>
                {label}
              </label>
              {!floatLabel && getInputElement(field)}
            </span>
          }
          {renderErrorMessage()}
        </div>
      )}
    />
  ) : (
    getInputElement()
  )
}
