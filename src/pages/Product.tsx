import { useApi } from "@/hooks"
import { ICategory } from "@/interfaces"
import { manageCategoryApi } from "@/apis"
import { ProductTable, ProductHeader } from "@/components"

import { useEffect, useState } from "react"

export const Product = () => {
  const { callApi: callApiGetCategory } = useApi<void>()
  const [categories, setCategories] = useState<ICategory[]>([])
  
  const getAllCategories = async () => {
    callApiGetCategory(async () => {
        const { data } = await manageCategoryApi.findAll()
        setCategories(data)
    })
  }
useEffect(() => {
    getAllCategories()
},[])

  return (
    <div className='w-full h-full'>
      <ProductHeader category={categories}/>
      <div className='h-full w-[95%] bg-off-white m-auto mt-4 rounded-lg'>      
        <ProductTable category={categories}/>
      </div>
    </div>
  )
}
