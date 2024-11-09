import { createBrowserRouter } from 'react-router-dom'
import { ManageCategory } from '@/pages'
import { DefaultLayout } from '@/layouts/DefaultLayout'
import { PATH } from '@/utils'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      // {
      //   path: '/',
      //   element: <Dashboard />
      // },
      {
        path: PATH.manageCategory,
        element: <ManageCategory />
      },
    ]
  }
])
