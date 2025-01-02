import { PATH } from '@/utils/constants/paths'
import { icons } from '@/utils/icons'
import { ReactElement } from 'react'

type SideBarItemType = {
  path: string
  icon: ReactElement
  title: string
  onClick?: (data?: any) => void
}
type SideBarMenuItemProps = {
  group?: string
  items: SideBarItemType[]
}
export const SIDE_BAR_ITEM_LIST: SideBarMenuItemProps[] = [
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
      }
    ]
  },
  {
    items: [
      {
        path: '/admin',
        icon: icons.logout,
        title: 'Logout',
        onClick: () => {
          console.log('Logout')
        }
      }
    ]
  }
]
