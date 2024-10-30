import React from 'react'

import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'

import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'

type CustomInputProps = {
  name?: string
  placeholder?: string
  size?: 'large' | 'medium' | 'small'
  className?: string
  type?: 'text' | 'password' | 'number'
  prefixIcon?: JSX.Element
  onChange?: (e: any) => void
  disabled?: boolean
  status?: 'error' | 'warning'
}

export const Input: React.FC<CustomInputProps> = ({
  name,
  placeholder,
  size = 'large',
  className,
  type = 'text',
  onChange,
  disabled = false,
  status
}) => {
  const inputClassNames = ` py-2
  ${size === 'small' ? 'p-inputtext-sm' : size === 'large' ? 'p-inputtext-lg ' : ''} 
  ${className}`

  return type === 'number' ? (
    <InputNumber
      placeholder={placeholder}
      id={name}
      name={name}
      pt={{
        input: {
          root: () => ({
            className: inputClassNames
          })
        }
      }}
      invalid={status === 'error' ? true : false}
      onChange={onChange}
      disabled={disabled}
      useGrouping={false}
    />
  ) : type === 'password' ? (
    <Password
      placeholder={placeholder}
      id={name}
      name={name}
      pt={{ input: { className: inputClassNames } }}
      invalid={status === 'error' ? true : false}
      onChange={onChange}
      disabled={disabled}
      feedback={false}
    />
  ) : (
    <InputText
      placeholder={placeholder}
      id={name}
      name={name}
      className={inputClassNames}
      invalid={status === 'error' ? true : false}
      onChange={onChange}
      disabled={disabled}
    />
  )
}
