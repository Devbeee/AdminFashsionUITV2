import { ManageCategory, CreateBlog, BlogsList, BlogDetail, UpdateBlog, Product } from '@/pages'
import { DefaultLayout } from '@/layouts/DefaultLayout'
import { PATH } from '@/utils'

import { createBrowserRouter } from 'react-router-dom'

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
      {
        path: PATH.product,
        element: <Product />
      }
    ]
  }
])
