import { PATH } from '@/utils/constants/paths'
import { icons } from '@/utils/icons'

export const SIDE_BAR_ITEM_LIST = [
  {
    group: 'DASHBOARDS',
    items: [
      {
        path: '/',
        icon: icons.home,
        title: 'Dashboard'
      },
      {
        path: '/test',
        icon: icons.home,
        title: 'Profit'
      },
      {
        path: PATH.orders,
        icon: icons.orders,
        title: 'Orders'
      }
    ]
  },
  {
    group: 'Products',
    items: [
      {
        path: '/admin/product',
        icon: icons.product,
        title: 'All Products'
      }
    ]
  },
  {
    group: 'Blogs',
    items: [
      {
        path: '/admin/blog/list',
        icon: icons.blogList,
        title: 'All Blogs'
      },
      {
        path: '/admin/blog/create',
        icon: icons.create,
        title: 'Create Blog'
      },
    ]
  },
  {
    items: [
      {
        path: '/',
        icon: icons.logout,
        title: 'Logout'
      }
    ]
  }
]
