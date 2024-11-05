import { Outlet } from 'react-router-dom'
import { Header, SideBar } from './partials'
import { useBoolean } from '@/hooks'
import { Button } from '@/components'

export function DefaultLayout() {
  const sideBarVisible = useBoolean(false)

  return (
    <div>
      <SideBar sideBarVisible={sideBarVisible} />

      <div className='bg-slate-200 min-h-screen'>
        <Header toggleSideBar={sideBarVisible.toggle} />
        <Outlet />
      </div>
    </div>
  )
}
