import { createBrowserRouter } from 'react-router-dom'
import { PATH } from '../utils/constants/paths'
import { Dashboard } from '../pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    children: []
  }
])
