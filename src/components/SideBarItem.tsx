import React, { ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'

type SideBarItemProps = {
  path: string
  icon: ReactElement
  title: string
  onClick: () => void
}
export const SideBarItem: React.FC<SideBarItemProps> = ({ path, icon, title, onClick }) => {
  const location = useLocation()
  const isActive = location.pathname === path
  const itemClassName = `w-full flex gap-4 items-center pl-6 hover:bg-slate-100 py-3 text-md transition-all duration-75 ${isActive && 'font-semibold text-black'}`

  return (
    <Link onClick={onClick} className={itemClassName} to={path}>
      <div className='text-partial-primary-700'>{icon}</div>
      <div>{title}</div>
    </Link>
  )
}
