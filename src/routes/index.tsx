import { createBrowserRouter } from 'react-router-dom'

import { PATH } from '@/utils'
import { DefaultLayout } from '@/layouts'
import { ManageCategory, CreateBlog, BlogsList, BlogDetail, UpdateBlog, Login, NotFound } from '@/pages'

import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: (
      <ProtectedRoute role='admin'>
        <DefaultLayout />
      </ProtectedRoute>
    ),
    children: [
      // {
      //   path: '/',
      //   element: <Dashboard />
      // },
      {
        path: PATH.manageCategory,
        element: <ManageCategory />
      },
      {
        path: PATH.blogCreate,
        element: <CreateBlog />
      },
      {
        path: PATH.blogList,
        element: <BlogsList />
      },
      {
        path: PATH.blogDetail,
        element: <BlogDetail />
      },
      {
        path: PATH.blogUpdate,
        element: <UpdateBlog />
      }
    ]
  },
  {
    path: PATH.login,
    element: <Login />
  },
  {
    path: PATH.notFound,
    element: <NotFound />
  }
])
