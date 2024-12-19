import { FilterOptions, OrderStatus, PaymentMethod, PaymentStatus, SortOptions } from '@/utils'

export const getOrderStatusByEnum = (orderEnum: OrderStatus) => {
  return orderEnum === OrderStatus.Delivered
    ? 'Đã giao hàng'
    : orderEnum === OrderStatus.Delivering
      ? 'Đang giao hàng'
      : orderEnum === OrderStatus.Confirmed
        ? 'Đã xác nhận'
        : orderEnum === OrderStatus.Pending
          ? 'Đang xử lí'
          : 'Đã hủy'
}

export const getPaymentStatusByEnum = (paymentStatusEnum: PaymentStatus) => {
  return paymentStatusEnum === PaymentStatus.Paid ? 'Đã thanh toán' : 'Chưa thanh toán'
}

export const getPaymentMethodByEnum = (paymentMethodEnum: PaymentMethod) => {
  return paymentMethodEnum === PaymentMethod.Stripe ? 'Stripe' : 'COD'
}

export const sortByEnumMapping = (value?: string) => {
  const stringToEnumMapping: Record<string, SortOptions> = {
    'date-decrease': SortOptions.DateDecrease,
    'date-increase': SortOptions.DateIncrease,
    'price-decrease': SortOptions.PriceDecrease,
    'price-increase': SortOptions.PriceIncrease
  }
  return value ? stringToEnumMapping[value] : SortOptions.DateDecrease
}

export const filterEnumMapping = (value?: string) => {
  const stringToEnumMapping: Record<string, FilterOptions> = {
    delivering: FilterOptions.Delivering,
    delivered: FilterOptions.Delivered,
    confirmed: FilterOptions.Confirmed,
    pending: FilterOptions.Pending,
    canceled: FilterOptions.Canceled,
    none: FilterOptions.None
  }
  return value ? stringToEnumMapping[value] : FilterOptions.None
}
