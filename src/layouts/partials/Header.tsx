import React, { useState } from 'react'

import { useForm } from 'react-hook-form'
import { BreadCrumb } from 'primereact/breadcrumb'
import { Button } from 'primereact/button'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { Search } from '@/components'
import { icons } from '@/utils'
import { Avatar } from 'primereact/avatar'

type HeaderProps = {
  toggleSideBar: () => void
}
export const Header: React.FC<HeaderProps> = ({ toggleSideBar }) => {
  //Seach Handle
  const defaultValues = {
    searchValue: ''
  }
  const schema = yup.object().shape({
    searchValue: yup.string().trim().required('Vui lòng nhập giá trị cần tìm!')
  })
  const useFormProps = useForm({ defaultValues, resolver: yupResolver(schema) })
  const [searchData, setSearchData] = useState(defaultValues)
  const onSubmit = (data: any) => {
    setSearchData(data.searchValue)
    useFormProps.reset()
  }
  const pathSegments =
    location.pathname === '/'
      ? [{ label: 'Dashboard', value: '' }]
      : location.pathname
          .split('/')
          .filter(Boolean)
          .map((segment) => ({
            label: segment.charAt(0).toUpperCase() + segment.slice(1),
            value: segment
          }))
  const items = pathSegments
  const home = { icon: icons.home, url: '#' }

  return (
    <div className='px-10 py-4 flex justify-between'>
      <div className='flex'>
        <Button
          className='text-2xl text-partial-primary-500 hover:bg-partial-primary-500 hover:text-white ring-0 '
          rounded
          text
          icon={icons.menu}
          onClick={toggleSideBar}
        ></Button>
        <BreadCrumb
          separatorIcon={icons.slash}
          className='border-none bg-transparent font-semibold text-sm'
          model={items}
          home={home}
        />
      </div>
      <div className='flex gap-5 items-center'>
        <div>
          <Search className='border-partial-primary-500' onSubmit={onSubmit} useFormProps={useFormProps} size='small' />
        </div>
        <div className='text-gray-600'>{icons.setting}</div>
        <Button className='p-0 ring-0' rounded text>
          <Avatar icon={icons.user} className='bg-partial-primary-500 text-white' shape='circle' />
        </Button>
      </div>
    </div>
  )
}
