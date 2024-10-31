import { createBrowserRouter } from 'react-router-dom'
import { Dashboard } from '@/pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />
  }
])
