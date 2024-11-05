import { SideBarMenuItem } from '@/components/SideBarMenuItem'
import { IUseBooleanReturn } from '@/interfaces'
import { SIDE_BAR_ITEM_LIST } from '@/utils/constants'
import { Menu } from 'primereact/menu'
import { Sidebar } from 'primereact/sidebar'

type ISideBar = {
  sideBarVisible: IUseBooleanReturn
}

export const SideBar: React.FC<ISideBar> = ({ sideBarVisible }) => {
  const items = SIDE_BAR_ITEM_LIST.map((item) => ({
    template: <SideBarMenuItem onClick={() => sideBarVisible.setFalse()} {...item} />
  }))

  return (
    <div>
      <Sidebar
        showCloseIcon={false}
        visible={sideBarVisible.value}
        modal={false}
        onHide={() => sideBarVisible.setFalse()}
        className='drop-shadow-sidebar'
        header={
          <div className='w-full flex items-center justify-center'>
            <div className='w-3/4'>
              <img src='/logo.webp' />
            </div>
          </div>
        }
        pt={{
          content: () => ({
            className: 'p-0'
          })
        }}
      >
        <div className='w-full'>
          <Menu model={items} className='border-0 w-full' />
        </div>
      </Sidebar>
    </div>
  )
}
