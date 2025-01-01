import { PATH } from '@/utils/constants/paths'
import { icons } from '@/utils/icons'

export const SIDE_BAR_ITEM_LIST = [
  {
    group: 'DASHBOARDS',
    items: [
      {
        path: PATH.dashboard,
        icon: icons.home,
        title: 'Dashboard'
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
      },
      {
        path: '/admin/manage-category',
        icon: icons.category,
        title: 'Category'
      },
      {
        path: '/admin/discount',
        icon: icons.discount,
        title: 'Discount'
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
