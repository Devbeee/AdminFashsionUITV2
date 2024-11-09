import { createBrowserRouter } from 'react-router-dom'
import { ManageCategory, CreateBlog, BlogsList, BlogDetail, UpdateBlog } from '@/pages'
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
      },
    ]
  }
])
