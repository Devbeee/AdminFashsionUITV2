import { instance as axiosClient } from '@/configs'
import { FilterOptions, OrderStatus, PaymentStatus, SortOptions } from '@/utils'

export const orderApi = {
  getAllOrders: async () => {
    return await axiosClient.get('/order/all')
  },
  getOrders: async (page: number, limit?: number, keyword?: string, sortBy?: SortOptions, filter?: FilterOptions) => {
    return await axiosClient.get(
      `/order/all/?page=${page}${limit ? `&limit=${limit}` : ''}${keyword ? `&keyword=${keyword}` : ''}${sortBy ? `&sortBy=${sortBy}` : ''}${filter ? `&filter=${filter}` : ''}`
    )
  },
  getOrder: async (id: string) => {
    return await axiosClient.get(`/order/?id=${id}`)
  },
  updateOrder: async (id: string, paymentStatus?: PaymentStatus, orderStatus?: OrderStatus) => {
    return await axiosClient.patch(
      `/order/update/?id=${id}${paymentStatus ? `&paymentStatus=${paymentStatus}` : ''}${orderStatus ? `&orderStatus=${orderStatus}` : ''}`
    )
  },
  cancelOrder: async (id: string) => {
    return await axiosClient.patch(`/order/cancel/?id=${id}`)
  },
  deleteOrder: async (id: string) => {
    return await axiosClient.delete(`/order/delete/?id=${id}`)
  },
  restoreOrder: async (id: string) => {
    return await axiosClient.patch(`/order/restore/?id=${id}`)
  }
}
