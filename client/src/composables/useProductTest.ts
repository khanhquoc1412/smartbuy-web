import { useListProductsSale } from "@/api/product/query"

const { data } = useListProductsSale(10)
export const useProductTest = () => ({ products: data })
