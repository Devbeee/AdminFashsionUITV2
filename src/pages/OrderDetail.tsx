import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'

import { orderApi } from '@/apis'
import { useApi } from '@/hooks'
import { IOrderDetailReturn, IOrderProduct } from '@/interfaces'
import {
  ConvertDateString,
  ConvertTimeString,
  getOrderStatusByEnum,
  getPaymentMethodByEnum,
  OrderStatus,
  PATH,
  PaymentMethod,
  PaymentStatus
} from '@/utils'
import { IToastFunctionOptions } from '@/interfaces/common.interface'
import { Toast } from 'primereact/toast'

export function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>()
  const { loading: callOrderApiLoading, callApi: callOrderApi } = useApi<void>()
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)

  const [order, setOrder] = useState<IOrderDetailReturn>()
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus>()
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<OrderStatus>()
  const showToast = (toasParams: IToastFunctionOptions) => {
    toast.current?.show({
      severity: toasParams.severity,
      summary: toasParams.summary,
      detail: toasParams.detail,
      life: toasParams.life
    })
  }
  const paymentStatusDropdownOptions = [
    {
      value: PaymentStatus.Paid,
      label: 'Đã thanh toán'
    },
    {
      value: PaymentStatus.Unpaid,
      label: 'Chưa thanh toán'
    }
  ]
  const orderStatusDropdownOptions = [
    {
      value: OrderStatus.Delivered,
      label: getOrderStatusByEnum(OrderStatus.Delivered)
    },
    {
      value: OrderStatus.Delivering,
      label: getOrderStatusByEnum(OrderStatus.Delivering)
    },
    {
      value: OrderStatus.Confirmed,
      label: getOrderStatusByEnum(OrderStatus.Confirmed)
    },
    {
      value: OrderStatus.Pending,
      label: getOrderStatusByEnum(OrderStatus.Pending)
    },
    {
      value: OrderStatus.Canceled,
      label: getOrderStatusByEnum(OrderStatus.Canceled)
    }
  ]
  const fetchOrder = async () => {
    if (orderId) {
      callOrderApi(async () => {
        const data = await orderApi.getOrder(orderId)
        if (data.data) {
          setOrder(data?.data)
          setSelectedPaymentStatus(data?.data.paymentStatus)
          setSelectedOrderStatus(data?.data.orderStatus)
        } else {
          navigate(PATH.notFound)
        }
      })
    }
  }
  useEffect(() => {
    fetchOrder()
  }, [])
  const handleUpdateOrder = (paymentStatus?: PaymentStatus, orderStatus?: OrderStatus) => {
    if (
      (paymentStatus || orderStatus) &&
      (paymentStatus !== order?.paymentStatus || orderStatus !== order?.orderStatus) &&
      order
    ) {
      callOrderApi(async () => {
        const data = await orderApi.updateOrder(order?.id, paymentStatus, orderStatus)
        if (data) {
          fetchOrder()
          showToast({ severity: 'success', summary: 'Success', detail: 'Order updated successfully!', life: 3000 })
        } else {
          showToast({ severity: 'error', summary: 'Error', detail: 'Update order failed!', life: 3000 })
        }
      })
    }
  }
  return (
    <div className='w-full h-full'>
      <Toast ref={toast} />

      {order && (
        <div className='h-full w-[95%] m-auto '>
          <div className='flex flex-row w-[95%] h-fit justify-between m-auto mt-6'>
            <div className='text-black-light text-2xl font-bold leading-tight text-left'>
              Order ID: <span className='text-primary ml-4'>{order?.id}</span>
            </div>
            <div className='flex items-center gap-2 text-xl font-semibold'>
              Created At:
              <div className='flex gap-2 text-red-700'>
                <div>{order && ConvertTimeString(order?.createdAt)}</div>
                <div>{order && ConvertDateString(order?.createdAt)}</div>
              </div>
            </div>
          </div>
          <div className=' bg-white mt-4 rounded-lg p-4'>
            <div className='flex gap-6 mb-2'>
              <div className='flex-1 flex flex-col gap-4'>
                <div className='font-semibold flex gap-2 text-xl'>
                  Consignee:<span className='text-lg font-normal'>{order?.address.name}</span>
                </div>
                <div>
                  <div className='font-semibold flex gap-2 text-xl'>
                    At:
                    <span className='text-lg font-normal'>
                      {`${order?.address?.addressDetail}, ${order?.address?.ward}, ${order?.address?.district}, ${order?.address?.province}`}
                    </span>
                  </div>
                </div>
                <div className='font-semibold flex gap-2 text-xl'>
                  Shipping method:
                  <span className='text-lg font-normal text-blue-600'>Tiêu chuẩn</span>
                </div>
                <div className='font-semibold flex gap-2 text-xl'>
                  Total price:
                  <span className='text-lg text-red-500 font-semibold'>
                    {order?.totalPrice.toLocaleString('de-De')}đ
                  </span>
                </div>
                <div className='font-semibold flex gap-2 text-xl'>
                  Message:
                  <span className='text-lg font-normal'>{order?.message}</span>
                </div>
              </div>
              <div className='w-0 border-r-[1px] border-dashed border-slate-500'></div>
              <div className='flex-1 flex flex-col gap-4'>
                <div className='flex gap-4'>
                  <div className='font-semibold flex gap-2 text-xl'>
                    Payment Method:
                    <span
                      className={`text-lg font-normal ${order?.paymentMethod === PaymentMethod.Stripe ? 'text-blue-500' : 'text-amber-500'}`}
                    >
                      {order?.paymentMethod && getPaymentMethodByEnum(order?.paymentMethod)}
                    </span>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='font-semibold text-xl'>Payment status: </div>
                  <Dropdown
                    value={selectedPaymentStatus}
                    onChange={(e) => handleUpdateOrder(e.value, undefined)}
                    options={paymentStatusDropdownOptions}
                    optionLabel='label'
                    placeholder='Select a Payment status'
                    className={`h-10 w-56 px-2 flex items-center justify-between`}
                    loading={callOrderApiLoading}
                  />
                </div>
                {order?.paymentMethod === PaymentMethod.Stripe &&
                  order?.paymentStatus === PaymentStatus.Paid &&
                  order?.paymentInvoiceId && (
                    <div className='font-semibold flex gap-2 text-xl'>
                      Payment Invoice ID:
                      <span className='text-lg font-normal'>{order?.paymentInvoiceId}</span>
                    </div>
                  )}
                <div className='font-semibold flex gap-2 text-xl'>
                  Payment time:
                  {order?.paidAt && (
                    <span className='text-lg font-normal'>
                      {order && ConvertTimeString(order?.paidAt)}
                      {'  ngày  '}
                      {order && ConvertDateString(order?.paidAt)}
                    </span>
                  )}
                </div>

                <div className='flex gap-2 items-center'>
                  <div className='font-semibold text-xl'>Order status:</div>
                  <Dropdown
                    value={selectedOrderStatus}
                    onChange={(e) => handleUpdateOrder(undefined, e.value)}
                    options={orderStatusDropdownOptions}
                    optionLabel='label'
                    placeholder='Select a Order status'
                    className={`h-10 w-56 px-2 flex items-center justify-between`}
                    loading={callOrderApiLoading}
                  />
                </div>
                {order?.orderStatus === OrderStatus.Delivered && order?.completedAt && (
                  <div className='font-semibold flex gap-2 text-xl'>
                    Completed At:
                    <span className='text-lg font-normal'>
                      {order && ConvertTimeString(order?.completedAt)}
                      {'  ngày  '}
                      {order && ConvertDateString(order?.completedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <DataTable
                onMouseDownCapture={(e) => {
                  e.stopPropagation()
                }}
                value={order?.products}
                tableStyle={{ minWidth: '50rem' }}
                loading={callOrderApiLoading}
                className='rounded-lg overflow-hidden border-[1px] border-solid border-slate-200'
              >
                <Column
                  alignHeader={'center'}
                  header='Product ID'
                  body={(data: IOrderProduct) => <div className='text-left font-semibold'>{data?.id}</div>}
                />
                <Column
                  alignHeader={'center'}
                  header='Product Image'
                  body={(data: IOrderProduct) => (
                    <div className=' flex items-center justify-center'>
                      <img className='w-20 h-auto' src={`${data.imgUrl}`} />
                    </div>
                  )}
                />
                <Column
                  alignHeader={'center'}
                  header='Product name'
                  body={(data: IOrderProduct) => <div className='text-center'>{data?.name}</div>}
                />
                <Column
                  alignHeader={'center'}
                  header='Size'
                  body={(data: IOrderProduct) => <div className='text-center'>{data?.size}</div>}
                />
                <Column
                  alignHeader={'left'}
                  header='Color'
                  body={(data: IOrderProduct) => (
                    <div className={`text-center flex items-center gap-2 justify-start`}>
                      {data?.color && (
                        <div
                          style={{ backgroundColor: data?.color }}
                          className={`w-4 h-4 border-[1px] border-solid border-black indent-10`}
                        ></div>
                      )}
                      {data?.colorName}
                    </div>
                  )}
                />
                <Column
                  alignHeader={'center'}
                  header='Original price'
                  body={(data: IOrderProduct) => (
                    <div className='text-center'>{data?.price.toLocaleString('de-De')}đ</div>
                  )}
                />
                <Column
                  alignHeader={'center'}
                  header='Discount'
                  body={(data: IOrderProduct) => <div className='text-center'>{data?.discount}%</div>}
                />
                <Column
                  alignHeader={'center'}
                  header='Price'
                  body={(data: IOrderProduct) => (
                    <div className='text-center'>
                      {((data?.price * (100 - data?.discount)) / 100).toLocaleString('de-De')}đ
                    </div>
                  )}
                />

                <Column
                  alignHeader={'center'}
                  header='Quantity'
                  body={(data: IOrderProduct) => <div className='text-center'>{data?.quantity}</div>}
                />
                <Column
                  alignHeader={'center'}
                  header='Total Price'
                  body={(data: IOrderProduct) => (
                    <div className='text-center text-red-500 font-semibold'>
                      {(((data?.price * (100 - data?.discount)) / 100) * data.quantity).toLocaleString('de-De')}đ
                    </div>
                  )}
                />
              </DataTable>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
