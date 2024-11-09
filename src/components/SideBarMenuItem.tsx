import { SideBarItem } from '@/components/SideBarItem'
import React, { ReactElement } from 'react'

type SideBarMenuItemProps = {
  group: string
  items: {
    path: string
    icon: ReactElement
    title: string
  }[]
  onClick: () => void
}
export const SideBarMenuItem: React.FC<SideBarMenuItemProps> = ({ group, items, onClick }) => {
  return (
    <div>
      <div className='py-2 pl-6 text-lg font-bold select-none text-partial-primary-700'>{group}</div>
      {items.map((item, index) => (
        <SideBarItem key={`sidebar-item-${index}`} onClick={onClick} {...item} />
      ))}
    </div>
  )
}
