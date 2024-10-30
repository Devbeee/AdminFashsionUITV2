import { Button as Btn } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import { ProgressSpinner } from 'primereact/progressspinner'

type CustomButtonProps = {
  className?: string
  size?: 'small'
  type?: 'success' | 'warning' | 'danger' | undefined
  htmlType?: 'button' | 'submit' | 'reset' | undefined
  to?: string
  shadow?: boolean
  onClick?: () => void
  loading?: boolean
  rounded?: boolean
  disabled?: boolean
  children?: React.ReactNode
}

export const Button: React.FC<CustomButtonProps> = ({
  className,
  size = 'small',
  type,
  htmlType,
  to,
  shadow = true,
  onClick,
  loading = false,
  rounded = false,
  disabled = false,
  children
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
      if (to) {
        navigate(to)
      }
    }
  }
  const btnClassNames = ` flex items-center justify-center
  ${className}`
  const childrenClassNames = `
  ${loading ? 'invisible' : ''}
  `
  return (
    <Btn
      type={htmlType}
      severity={type}
      disabled={loading ? loading : disabled}
      className={btnClassNames}
      onClick={handleClick}
      raised={shadow}
      size={size}
      rounded={rounded}
    >
      {loading ? <ProgressSpinner className='absolute w-5 h-5 ' /> : undefined}
      <div className={childrenClassNames}>{children}</div>
    </Btn>
  )
}
