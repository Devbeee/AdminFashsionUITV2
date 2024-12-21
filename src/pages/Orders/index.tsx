import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Paginator } from 'primereact/paginator'

import { filterEnumMapping, icons, sortByEnumMapping, FilterOptions, SortOptions } from '@/utils'
import { orderApi } from '@/apis'
import { useApi } from '@/hooks'
import { IOrderReturn } from '@/interfaces'
import { Table } from '@/pages/Orders/Table'
import { filterOptions, selectedOptionTemplate, sortOptions, sortOptionTemplate } from '@/pages/Orders/DropdownOption'
import { Toast } from 'primereact/toast'
import { IToastFunctionOptions } from '@/interfaces/common.interface'

type PaginationType = {
  totalPages?: number
  totalOrders?: number
  currentPage?: number
  limit?: number
}

export function Orders() {
  const location = useLocation()
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const queryParamPage = parseInt(queryParams.get('page') || '1')
  const queryParamLimit = parseInt(queryParams.get('limit') || '5')
  const queryParamSortBy = sortByEnumMapping(queryParams.get('sortBy') ?? SortOptions.DateDecrease)
  const queryParamFilter = filterEnumMapping(queryParams.get('filter') ?? FilterOptions.None)

  const { loading: callOrderApiLoading, callApi: callOrderApi } = useApi<void>()

  const [orders, setOrders] = useState<IOrderReturn[]>([])
  const [selectedOrder, setSelectedOrder] = useState<IOrderReturn>()

  const [pagination, setPagination] = useState<PaginationType>({})
  const [inputKeyword, setInputKeyword] = useState<string>(queryParams.get('keyword') ?? '')
  const [currentKeyword, setCurrentKeyword] = useState<string>(queryParams.get('keyword') ?? '')
  const [currentSortBy, setCurrentSortBy] = useState<SortOptions>(queryParamSortBy)
  const [currentFilter, setCurrentFilter] = useState<FilterOptions>(queryParamFilter)

  const showToast = (toasParams: IToastFunctionOptions) => {
    toast.current?.show({
      severity: toasParams.severity,
      summary: toasParams.summary,
      detail: toasParams.detail,
      life: toasParams.life
    })
  }
  const deleteConfirm = () => {
    confirmDialog({
      message: 'Are you sure you want to delete this order?',
      header: 'Delete',
      icon: <span className='text-red-500 text-2xl'>{icons.warning}</span>,
      defaultFocus: 'accept',
      accept: () => handleDeleteOrder(),
      reject: () => {}
    })
  }
  const handleDeleteOrder = () => {
    selectedOrder &&
      callOrderApi(async () => {
        const data = await orderApi.deleteOrder(selectedOrder.id)
        if (data) {
          fetchOrderWithCurrentParams()
          showToast({ severity: 'success', summary: 'Success', detail: 'Order deleted successfully!', life: 3000 })
        } else {
          showToast({ severity: 'error', summary: 'Error', detail: 'Delete order failed!', life: 3000 })
        }
      })
  }
  const handleRestoreOrder = () => {
    selectedOrder &&
      callOrderApi(async () => {
        const data = await orderApi.restoreOrder(selectedOrder.id)
        if (data) {
          fetchOrderWithCurrentParams()
          showToast({ severity: 'success', summary: 'Success', detail: 'Order restored successfully!', life: 3000 })
        } else {
          showToast({ severity: 'error', summary: 'Error', detail: 'Restore order failed!', life: 3000 })
        }
      })
  }
  const getNavigateParams = (limit: number = 5, keyword?: string, sortBy?: SortOptions, filter?: FilterOptions) => {
    return {
      sortBy: sortBy ? `&sortBy=${sortBy}` : '',
      filter: filter ? `&filter=${filter}` : '',
      limit: limit ? `&limit=${limit}` : '',
      keyword: keyword ? `&keyword=${keyword}` : ''
    }
  }
  const fetchOrders = (
    page: number = 1,
    limit: number = 5,
    keyword?: string,
    sortBy?: SortOptions,
    filter?: FilterOptions
  ) => {
    callOrderApi(async () => {
      const data = await orderApi.getOrders(page, limit, keyword, sortBy, filter)
      if (data) {
        setOrders(data?.data?.orders || [])
        setPagination(data?.data?.pagination || {})
        const param = getNavigateParams(limit, keyword, sortBy, filter)
        navigate(
          `?page=${data?.data?.pagination?.currentPage}${param.limit}${param.keyword}${param.sortBy}${param.filter}`
        )
      } else {
        showToast({ severity: 'error', summary: 'Error', detail: 'Fetch orders failed!', life: 3000 })
      }
    })
  }
  const fetchOrderWithCurrentParams = () => {
    fetchOrders(
      queryParamPage,
      queryParamLimit,
      currentKeyword ? currentKeyword : undefined,
      currentSortBy,
      currentFilter
    )
  }
  const onChangePage = (page: number, size: number) => {
    if (page !== pagination.currentPage || size != pagination.limit) {
      if (inputKeyword !== currentKeyword) {
        setInputKeyword(currentKeyword)
      }
      fetchOrders(page, size, currentKeyword, currentSortBy, currentFilter)
    }
  }
  const handleSearchOrder = () => {
    if (inputKeyword !== currentKeyword) {
      setCurrentKeyword(inputKeyword)
      fetchOrders(1, pagination.limit, inputKeyword ? inputKeyword : undefined, currentSortBy, currentFilter)
    }
  }
  const handleChangeSortOption = (value: SortOptions) => {
    setCurrentSortBy(value)
    fetchOrders(queryParamPage, queryParamLimit, currentKeyword, value, currentFilter)
  }
  const handleChangeFilterOption = (value: FilterOptions) => {
    setCurrentFilter(value)
    fetchOrders(queryParamPage, queryParamLimit, currentKeyword, currentSortBy, value)
  }
  useEffect(() => {
    fetchOrderWithCurrentParams()
  }, [])
  return (
    <div className='w-full h-full'>
      <Toast ref={toast} />
      <div className='h-full w-[95%] m-auto '>
        <div>
          <div className='flex flex-row w-[95%] h-fit justify-between m-auto mt-6'>
            <div className='text-black-light text-2xl font-bold leading-tight text-left'>Order List</div>
            <div>
              <div className='flex items-end gap-4'>
                <div className='flex items-center gap-2'>
                  <span className='flex items-center text-lg text-black'>Filter:</span>
                  <Dropdown
                    value={currentFilter}
                    onChange={(e) => handleChangeFilterOption(e.value)}
                    options={filterOptions}
                    optionLabel='label'
                    className='w-40'
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <span className='flex items-center text-lg text-black'>Sort:</span>
                  <Dropdown
                    optionLabel='label'
                    optionValue='value'
                    value={currentSortBy}
                    onChange={(e) => handleChangeSortOption(e.value)}
                    options={sortOptions}
                    valueTemplate={selectedOptionTemplate}
                    itemTemplate={sortOptionTemplate}
                    className='w-36'
                  />
                </div>
                <div className={`relative flex items-center gap-2 `}>
                  <Button
                    size='small'
                    className='absolute w-10 h-10 p-2 text-2xl text-gray-500 ring-0 left-1'
                    type='submit'
                    rounded
                    text
                    icon={icons.search}
                    onClick={handleSearchOrder}
                  ></Button>
                  <InputText
                    placeholder='Order ID, Product name,...'
                    size={'small'}
                    className={` pl-10  w-80 `}
                    onChange={(e) => setInputKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchOrder()
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Table
          orders={orders}
          callOrderApiLoading={callOrderApiLoading}
          setSelectedOrder={setSelectedOrder}
          selectedOrder={selectedOrder}
          handleRestoreOrder={handleRestoreOrder}
          deleteConfirm={deleteConfirm}
        />
        <div className=' bg-white mt-4 rounded-lg'>
          <div>
            <Paginator
              rows={pagination?.limit}
              first={((pagination?.currentPage || 1) - 1) * (pagination?.limit || 5)}
              totalRecords={pagination?.totalOrders}
              rowsPerPageOptions={[pagination?.limit && pagination?.limit < 10 ? pagination.limit : 5, 10, 25, 50]}
              onPageChange={(e) => onChangePage(e.page + 1, e.rows)}
            />
          </div>
        </div>
      </div>
      <ConfirmDialog
        acceptClassName='bg-red-500 opacity-95 ring-0 border-none hover:opacity-100 hover:drop-shadow-md'
        rejectClassName='text-slate-500 bg-transparent ring-0 border-none hover:opacity-90'
      />
    </div>
  )
}
