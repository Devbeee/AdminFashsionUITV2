import { ProductTable, ProductHeader } from "@/components"

export const Product = () => {
  return (
    <div className='w-full h-full'>
      <ProductHeader />
      <div className='h-full w-[95%] bg-off-white m-auto mt-4 rounded-lg'>      
        <ProductTable />
      </div>
    </div>
  )
}
