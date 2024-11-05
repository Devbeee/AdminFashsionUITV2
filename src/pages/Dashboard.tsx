import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { Dialog } from 'primereact/dialog'
import { Button, Input } from '@/components'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { SiEagle } from 'react-icons/si'
import { BiTrash } from 'react-icons/bi'

export const Dashboard = () => {
  const [showMessage, setShowMessage] = useState(false)
  const defaultValues = {
    name: '',
    email: '',
    password: '',
    number: 0
  }
  const [formData, setFormData] = useState(defaultValues)
  const emailSchema = yup.object().shape({
    email: yup.string().trim().email('Email không hợp lệ!').required('Vui lòng nhập email!')
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ defaultValues, resolver: yupResolver(emailSchema) })

  const onSubmit = (data: any) => {
    setFormData(data)
    setShowMessage(true)

    reset()
  }
  const dialogFooter = (
    <div className='flex justify-content-center'>
      <Button className='p-button-text' onClick={() => setShowMessage(false)}>
        OK
      </Button>
    </div>
  )

  return (
    <div className='form-demo  w-full flex justify-center mt-10'>
      <Dialog
        visible={showMessage}
        onHide={() => setShowMessage(false)}
        position='top'
        footer={dialogFooter}
        showHeader={false}
        breakpoints={{ '960px': '80vw' }}
        style={{ width: '30vw' }}
      >
        <div className='flex justify-content-center flex-column pt-6 px-3'>
          <i className='pi pi-check-circle' style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
          <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
            Your account is registered under name <b>{formData.number}</b> ; it'll be valid next 30 days without
            activation. Please check <b>{formData.email}</b> for activation instructions.
          </p>
        </div>
      </Dialog>

      <div className='flex justify-content-center'>
        <div className='card gap-3'>
          <div className='text-center text-4xl font-bold mb-4'>Register</div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='p-fluid flex flex-col gap-7 w-[600px] bg-white shadow-lg p-6 rounded-lg'
          >
            <Input errors={errors} control={control} name='number' label='Enter your number*' type='number' />
            <Input errors={errors} control={control} name='name' label='Enter your name*' type='text' />
            <Input errors={errors} control={control} name='email' label='Enter your email*' type='text' />
            <Input errors={errors} control={control} name='password' label='Enter your password*' type='password' />
            <Button htmlType='submit'>Button</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
