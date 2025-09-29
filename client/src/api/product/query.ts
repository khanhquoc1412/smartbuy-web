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
  UseQueryOptions,
  useInfiniteQuery,
  useQuery,
} from "vue-query";
import {
  fetchProduct,
  fetchProductDetails,
  fetchProductOfCategory,
  fetchBase,
  fetchProductVariant,
  fetchProductByKeyword
} from "./product";
import { IParams } from "@/types/product.types";

export const useListProductsInfiniteQuery = () => {
  return useInfiniteQuery(
    "productsInfinite",
    ({ pageParam: page }) =>
      fetchProduct({
        limit: 2,
        page,
      }),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.page >= lastPage.total) return undefined;
        return lastPage.page + 1;
      },
      staleTime: 1000000,
      refetchOnWindowFocus: false,
    }
  );
};

export const useListProducts = (params?: Ref<IParams>) => {
  return useQuery(
    ["products", params?.value.page],
    () =>
      fetchProduct({
        limit: params?.value.limit || 1,
        page: params?.value.page,
        ...(params?.value.brand && { brand: params.value.brand }),
        ...(params?.value.order && { order: params.value.order }),
        ...(params?.value.dir && { dir: params.value.dir }),
      }),
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const useGetProductDetails = (slug: string) => {
  return useQuery(["product-details", slug], () => fetchProductDetails(slug), {
    refetchOnWindowFocus: false,
  });
};

export const useGetProductVariant = (productVariantId: string) => {
  return useQuery(
    ["product-variant", productVariantId],
    () => fetchProductVariant(productVariantId),
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const useGetProductsByCategory = (
  categoryName: string,
  params?: Ref<IParams>,
  enabled?: boolean
) => {
  return useQuery(
    ["products-categories", categoryName],
    () => fetchProductOfCategory(categoryName, params?.value),
    {
      enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export const useGetProductByKeyword = (
  keyword: string,
  params?: Ref<IParams>,
  enabled?: boolean
) => {
  return useQuery(
    ["products-search", keyword],
    () => fetchProductByKeyword(keyword, params?.value),
    {
      enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export const useListProductsSale = (quantity: number) => {
  return useQuery(
    ["product-sale", quantity],
    () => fetchBase(quantity),
    {
      refetchOnWindowFocus: false,
      select: (data) => data.products,
    }
  );
};
