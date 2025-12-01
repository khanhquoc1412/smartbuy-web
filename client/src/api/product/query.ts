// import {
//     UseQueryOptions,
//     useInfiniteQuery,
//     useMutation,
//     useQuery,
// } from "vue-query";
// import {
//     fetchProduct,
//     fetchProductDetails,
//     fetchProductOfCategory,
//     fetchBase,
//     addProductToCart,
//     fetchUserCarts,
//     fetchProductVariant,
//     fetchProductByKeyword
// } from "./product";
// import { IParams, } from "@/types/product.types";


// export const useListProductsInfiniteQuery = () => {
//     return useInfiniteQuery("productsInfinite", ({ pageParam: page }) =>
//         fetchProduct({
//             limit: 2,
//             page
//         }),
//         {
//             getNextPageParam: (lastPage) => {
//                 if (lastPage.page >= lastPage.total) return undefined;
//                 return lastPage.page + 1;
//             },
//             staleTime: 1000000,
//             refetchOnWindowFocus: false
//         }
//     );
// };
// export const useListProducts = (params?: Ref<IParams>) => {

//     return useQuery(["products", params?.value.page], () =>
//         fetchProduct({
//             limit: params?.value.limit || 1,
//             page: params?.value.page,
//             ...(params?.value.brand && { brand: params.value.brand }),
//             ...(params?.value.order && { order: params.value.order }),
//             ...(params?.value.dir && { dir: params.value.dir }),
//         }),
//         {
//             refetchOnWindowFocus: false,
//         }
//     );
// }
// export const useGetProductDetails = (slug: string) => {
//     return useQuery(["product-details", slug], () =>
//         fetchProductDetails(slug),
//         {
//             refetchOnWindowFocus: false
//         }
//     );
// };

// export const useGetProductVariant = (productVariantId: string) => {
//     return useQuery(["product-variant", productVariantId], () =>
//         fetchProductVariant(productVariantId),
//         {
//             refetchOnWindowFocus: false
//         }
//     );
// };
// export const useGetProductsByCategory = (
//     categoryName: string,
//     params?: Ref<IParams>,
//     enabled?: boolean
// ) => {
//     return useQuery(
//         ["products-categories", categoryName],
//         () => fetchProductOfCategory(categoryName, params?.value),
//         {
//             enabled,
//             refetchOnWindowFocus: false
//         }
//     );
// };

// export const useGetProductByKeyword = (
//     keyword: string,
//     params?: Ref<IParams>,
//     enabled?: boolean
// ) => {
//     return useQuery(
//         ["products-categories", keyword],
//         () => fetchProductByKeyword(keyword, params?.value),
//         {
//             enabled,
//             refetchOnWindowFocus: false
//         }
//     );
// };

// export const useListProductsSale = (quantity: number) => {
//     return useQuery(["product-sale", quantity], () =>
//         fetchBase(quantity),
//         {
//             refetchOnWindowFocus: false,
//             select: (data) => data.products
//         }
//     );
// }

// export const useGetUserCarts = (userId: string | number) => {
//     return useQuery("user-carts", () =>
//         fetchUserCarts(userId),
//         {
//             refetchOnWindowFocus: false,
//         }
//     );
// };


// export const useAddProductToCartMutation = () => {
//     return useMutation(
//         ["add-product-to-cart"],
//         ({
//             userId,
//             productVariantId,
//         }: {
//             userId: string | number;
//             productVariantId: string | number;
//         }) => addProductToCart(userId, productVariantId)
//     );
// };








import {
  useInfiniteQuery,
  useQuery,
} from "@tanstack/vue-query";  // ✅ Đổi import


import {
  fetchProduct,
  fetchProductDetails,
  fetchProductOfCategory,
  fetchBase,
  fetchProductVariant,
  fetchProductByKeyword,
  fetchTopSellingProducts
} from "./product";
import {
  IParams,
  IProduct,
  IProductVariant,
  IProductsListResponse,
  ITopSellingResponse,
} from "@/types/product.types";
import { computed, unref, Ref } from "vue";

// ✅ Infinite Query - Giữ nguyên logic
export const useListProductsInfiniteQuery = () => {
  return useInfiniteQuery({
    queryKey: ['productsInfinite'],
    queryFn: ({ pageParam }) =>
      fetchProduct({
        limit: 2,
        page: pageParam as number,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.total) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
  });
};

// ✅ List Products - GIỮ NGUYÊN LOGIC FILTER/SORT
export const useListProducts = (params?: Ref<IParams>) => {
  return useQuery({
    queryKey: ["products", params?.value],  // ✅ Watch toàn bộ params để auto-refetch
    queryFn: () =>
      fetchProduct({
        limit: params?.value.limit || 1,
        page: params?.value.page,
        ...(params?.value.brand && { brand: params.value.brand }),      // ✅ Lọc theo brand
        ...(params?.value.order && { order: params.value.order }),      // ✅ Sắp xếp theo field
        ...(params?.value.dir && { dir: params.value.dir }),            // ✅ Tăng/giảm dần
      }),
    refetchOnWindowFocus: false,
    enabled: !!params?.value,  // ✅ Chỉ chạy khi có params
  });
};

// ✅ Product Details
export const useGetProductDetails = (slug: string) => {
  return useQuery({
    queryKey: ["product-details", slug],
    queryFn: () => fetchProductDetails(slug),
    refetchOnWindowFocus: false,
    enabled: !!slug,
  });
};

// ✅ Product Variant
export const useGetProductVariant = (productVariantId: string) => {
  return useQuery({
    queryKey: ["product-variant", productVariantId],
    queryFn: () => fetchProductVariant(productVariantId),
    refetchOnWindowFocus: false,
    enabled: !!productVariantId,
  });
};

// ✅ Products by Category - GIỮ NGUYÊN LOGIC FILTER
export const useGetProductsByCategory = (
  categoryName: string,
  params?: Ref<IParams>,
  enabled?: boolean
) => {
  return useQuery({
    queryKey: ["products-categories", categoryName, params?.value],  // ✅ Watch params
    queryFn: () => fetchProductOfCategory(categoryName, params?.value),
    enabled: enabled && !!categoryName,
    refetchOnWindowFocus: false,
    select: (data) => data // No transformation needed
  });
};

// ✅ Search Products by Keyword - GIỮ NGUYÊN LOGIC FILTER
export const useGetProductByKeyword = (
  keyword: string | Ref<string>,
  params?: Ref<IParams>,
  enabled?: boolean
) => {
  return useQuery({
    queryKey: ["products-search", keyword, params?.value],  // ✅ Watch params & keyword
    queryFn: () => fetchProductByKeyword(unref(keyword), params?.value),
    enabled: enabled && !!unref(keyword),
    refetchOnWindowFocus: false,
  });
};

// ✅ Products Sale
export const useListProductsSale = (quantity: number) => {
  return useQuery({
    queryKey: ["product-sale", quantity],
    queryFn: () => fetchBase(quantity),
    refetchOnWindowFocus: false,
    select: (data) => data.products,
  });
};
// ✅ Top Selling Products
export const useListTopSellingProducts = (limit: number = 5) => {
  return useQuery({
    queryKey: ["product-top-selling", limit],
    queryFn: () => fetchTopSellingProducts(limit),
    refetchOnWindowFocus: false,
    select: (data: ITopSellingResponse) => data.data, // API returns { success: true, data: [...] }
  });
};
