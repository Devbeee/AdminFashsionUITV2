import * as yup from 'yup'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from 'primereact/checkbox'
import { yupResolver } from '@hookform/resolvers/yup'

import { authApi } from '@/apis'
import { useAuthStore } from '@/stores'
import { ILoginData } from '@/interfaces'
import { useApi, useBoolean } from '@/hooks'
import { Button, Input } from '@/components'
import { LOCAL_STORAGE_KEYS, PATH } from '@/utils'

const loginSchema = yup.object().shape({
  email: yup.string().trim().email('Email không hợp lệ!').required('Vui lòng nhập email!'),
  password: yup.string().min(8, 'Mật khẩu ít nhất 8 ký tự').required('Vui lòng nhập mật khẩu!')
})

export const Login = () => {
  const navigate = useNavigate()
  const { value: isRememberMe, toggle: toggleRememberMe } = useBoolean(false)

  const { isLoggedIn, setCurrentUser, resetMessage } = useAuthStore()

  const { loading, errorMessage, callApi: callApiLogin } = useApi<void>()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema)
  })

  const handleLogin = (loginData: ILoginData) => {
    resetMessage()
    callApiLogin(async () => {
      const { data } = await authApi.login(loginData)
      if (data) {
        reset()
        navigate(PATH.dashboard)
        setCurrentUser(data.currentUser)
        localStorage.setItem(LOCAL_STORAGE_KEYS.isLoggedIn, 'true')
      }
    })
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate(PATH.dashboard)
    }
  }, [isLoggedIn, navigate])

  return (
    <section className='bg-auth'>
      <div className='px-5 min-h-screen flex justify-center items-center '>
        <div className='w-[480px] border border-[##dfe7ef] bg-white rounded-md p-16'>
          <div className='mb-4'>
            <div className='text-xl font-bold mb-2'>Log in</div>
            <span className='text-gray-500 font-medium'>Please enter your details</span>
          </div>
          {errorMessage && <span className='text-red-500 mb-2 text-lg'>{errorMessage}</span>}
          <div className='mt-6'>
            <form onSubmit={handleSubmit(handleLogin)} className='p-fluid flex flex-col gap-y-6 bg-white rounded-lg'>
              <Input
                errors={errors}
                control={control}
                name='email'
                type='text'
                placeholder='Email'
                className='h-12 text-base text-slate-800'
              />
              <Input
                errors={errors}
                control={control}
                name='password'
                type='password'
                placeholder='Password'
                className='h-12 text-base text-slate-800'
              />
              <div className='flex align-items-center'>
                <Checkbox
                  inputId='remember'
                  name='remember'
                  value='Cheese'
                  onChange={toggleRememberMe}
                  checked={isRememberMe}
                />
                <label htmlFor='remember' className='ml-2'>
                  Remember me
                </label>
              </div>
              <Button
                htmlType='submit'
                className='bg-primary hover:bg-primary-hover font-semibold text-base h-12'
                disabled={loading}
                loading={loading}
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
