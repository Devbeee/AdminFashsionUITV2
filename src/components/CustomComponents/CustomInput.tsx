import React from 'react'

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
  const INPUT_SIZE_CLASS = {
    small: 'p-inputtext-sm',
    medium: '',
    large: 'p-inputtext-lg '
  }

  const inputClassNames = ` py-2
  ${INPUT_SIZE_CLASS[size]} 
  ${className}`

  const INPUT_ELEMENT = {
    number: (
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
    ),
    password: (
      <Password
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
        feedback={false}
      />
    ),
    text: (
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
  return type ? INPUT_ELEMENT[type] : INPUT_ELEMENT['text']
}
