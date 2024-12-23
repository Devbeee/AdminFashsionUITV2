import { FilterOptions, PaymentMethod, SortOptions } from '@/utils'

export const getPaymentMethodByEnum = (paymentMethodEnum: PaymentMethod) => {
  return paymentMethodEnum === PaymentMethod.Stripe ? 'Stripe' : 'COD'
}

export const sortByEnumMapping = (value?: string) => {
  const stringToEnumMapping: Record<string, SortOptions> = {
    'DATE-DECREASE': SortOptions.DateDecrease,
    'DATE-INCREASE': SortOptions.DateIncrease,
    'PRICE-DECREASE': SortOptions.PriceDecrease,
    'PRICE-INCREASE': SortOptions.PriceIncrease
  }
  return value ? stringToEnumMapping[value] : SortOptions.DateDecrease
}
