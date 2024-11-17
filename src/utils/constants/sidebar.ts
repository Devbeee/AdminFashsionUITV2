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
        path: '/test/test2',
        icon: icons.home,
        title: 'Analytics'
      }
    ]
  },
  {
    group: 'Products',
    items: [
      {
        path: '/#',
        icon: icons.home,
        title: 'All Products'
      },
      {
        path: '/#',
        icon: icons.home,
        title: 'Product Detail'
      },
      {
        path: '/#',
        icon: icons.home,
        title: 'Edit Product'
      }
    ]
  },
  {
    items: [
      {
        path: '/',
        icon: icons.logout,
        title: 'Logout',
        
      }
    ]
  }
]
