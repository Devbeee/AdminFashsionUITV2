import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

import { icons } from '@/utils'

type SearchProps = {
  placeholder?: string
  floatLabel?: boolean
  size?: 'large' | 'medium' | 'small'
  className?: string
  onChange?: (e: any) => void
  onSubmit: (e: any) => void
  disabled?: boolean
  useFormProps: any
}
export const Search: React.FC<SearchProps> = ({
  placeholder = 'Search',
  size = 'large',
  className,
  onSubmit,
  useFormProps,
  disabled
}) => {
  const [isInvalid, setIsInvalid] = useState(false)

  const inputSizes = {
    small: 'p-inputtext-sm',
    medium: '',
    large: 'p-inputtext-lg'
  }
  const inputCommonProps = {
    placeholder,
    id: 'searchValue',
    disabled
  }
  const inputClassNames = `py-2 
  ${className} 
  ${inputSizes[size]} 
  `

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useFormProps
  const renderErrorMessage = () => {
    errors?.['searchValue'] ? setIsInvalid(true) : setIsInvalid(false)
    return undefined
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <Controller
        name={'searchValue'}
        control={control}
        render={({ field }) => (
          <div className='relative'>
            <Button
              size='small'
              className='absolute text-2xl text-gray-500 p-2 h-10 w-10 ring-0 left-1'
              type='submit'
              rounded
              text
              icon={icons.search}
            ></Button>
            <InputText
              {...inputCommonProps}
              size={'small'}
              className={`rounded-full pl-10  ${inputClassNames}`}
              {...field}
              invalid={isInvalid}
            />

            {renderErrorMessage()}
          </div>
        )}
      />
    </form>
  )
}
