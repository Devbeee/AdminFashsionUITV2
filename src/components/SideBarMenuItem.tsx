import { SideBarItem } from '@/components/SideBarItem'
import React, { ReactElement } from 'react'

type SideBarMenuItemProps = {
  title: string
  items: {
    path: string
    icon: ReactElement
    title: string
  }[]
  onClick: () => void
}
export const SideBarMenuItem: React.FC<SideBarMenuItemProps> = ({ title, items, onClick }) => {
  return (
    <div>
      <div className='pl-6 font-bold text-lg text-partial-primary-700 py-2 select-none'>{title}</div>
      {items.map((item) => (
        <SideBarItem onClick={onClick} {...item} />
      ))}
    </div>
  )
}
