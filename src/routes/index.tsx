import { createBrowserRouter } from 'react-router-dom'
import { Dashboard } from '@/pages'
import { DefaultLayout } from '@/layouts/DefaultLayout'
import path from 'path'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/test',
        element: <Dashboard />
      },
      {
        path: '/test/test2',
        element: <Dashboard />
      }
    ]
  }
])
