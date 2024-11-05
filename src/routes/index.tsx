import { createBrowserRouter } from 'react-router-dom'
import { Dashboard, CreateBlog, BlogsList, BlogDetail, UpdateBlog } from '@/pages'
import {PATH} from '@/utils'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />
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
])
