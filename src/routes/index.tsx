import { createBrowserRouter } from 'react-router-dom'
import { Dashboard, Product } from '@/pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/product',
    element: <Product />,
  }
])
