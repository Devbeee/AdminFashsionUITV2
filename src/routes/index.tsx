import { createBrowserRouter } from 'react-router-dom'
import { Dashboard, ManageCategory } from '@/pages'
import { PATH } from '@/utils'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: PATH.manageCategory,
    element: <ManageCategory />
  }
])
