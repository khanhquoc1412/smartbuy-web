// import { ICartResponse, IUserCarts } from "@/types/cart.types";
// import {
//   IParams,
//   IProduct,
//   IProductVariant,
//   IProductsListResponse,
// } from "@/types/product.types";

// // ⚡ dùng productAxios thay vì $axios
// import { productAxios } from "@plugins/axios/axios";

// export const fetchProduct = (params: IParams) => {
//   return productAxios.get<unknown, IProductsListResponse>("/product/get-all", {
//     params,
//   });
// };

// export const fetchProductDetails = (slug: string) => {
//   return productAxios.get<unknown, IProduct>(`/product/${slug}`);
// };

// export const fetchProductVariant = (productVariantId: string) => {
//   return productAxios.get<unknown, IProductVariant>(
//     `/product/variant/${productVariantId}`
//   );
// };

// export const fetchProductOfCategory = (
//   categoryName: string,
//   params?: IParams
// ) => {
//   return productAxios.get<unknown, IProductsListResponse>(
//     `/product/get-all/${categoryName}`,
//     {
//       params,
//     }
//   );
// };

// export const fetchProductByKeyword = (keyword: string, params?: IParams) => {
//   return productAxios.get<unknown, IProductsListResponse>(
//     `/product/search/${keyword}`,
//     {
//       params,
//     }
//   );
// };

// export const fetchBase = (quantity: number) => {
//   return productAxios.get<unknown, IProductsListResponse>("/product/sale", {
//     params: {
//       quantity,
//     },
//   });
// };

// export const fetchProductFilter = (params: Ref<IParams>) => {
//   return productAxios.get<unknown, IProductsListResponse>("/product/get-all", {
//     params: params.value,
//   });
// };

// // ❌ Cart API không nên để ở đây vì nó thuộc cart-service
// // Nếu bạn vẫn để tạm thì phải gọi đúng service port khác
// export const addProductToCart = (
//   userId: string | number,
//   productVariantId: string | number
// ) => {
//   return productAxios.post<unknown, ICartResponse>(`/carts/add`, {
//     userId,
//     productVariantId,
//   });
// };

// export const removeProductInCart = (cartItemId: string | number) => {
//   return productAxios.delete<unknown, unknown>(`/carts/${cartItemId}`);
// };

// export const decreaseQuantity = (cartItemId: string | number) => {
//   return productAxios.patch<unknown, unknown>(`/carts/decr-qty/${cartItemId}`);
// };

// export const fetchUserCarts = (
//   userId: string | number,
//   params?: IParams
// ) => {
//   return productAxios.get<unknown, IUserCarts>(`/carts/user/${userId}`, {
//     params,
//   });
// };







import {
  IParams,
  IProduct,
  IProductVariant,
  IProductsListResponse,
} from "@/types/product.types";

// ⚡ Dùng productAxios cho ProductService
import { productAxios } from "@plugins/axios/axios";

// 📌 Lấy tất cả sản phẩm (có phân trang, lọc)
export const fetchProduct = (params: IParams) => {
  return productAxios.get<unknown, IProductsListResponse>("/product/get-all", {
    params,
  });
};

// 📌 Lấy chi tiết sản phẩm theo slug
export const fetchProductDetails = (slug: string) => {
  return productAxios.get<unknown, IProduct>(`/product/${slug}`);
};

// 📌 Lấy thông tin biến thể sản phẩm
export const fetchProductVariant = (productVariantId: string) => {
  return productAxios.get<unknown, IProductVariant>(
    `/product/variant/${productVariantId}`
  );
};

// 📌 Lấy sản phẩm theo category
export const fetchProductOfCategory = (
  categoryName: string,
  params?: IParams
) => {
  return productAxios.get<unknown, IProductsListResponse>(
    `/product/get-all/${categoryName}`,
    { params }
  );
};

// 📌 Tìm kiếm sản phẩm theo keyword
export const fetchProductByKeyword = (keyword: string, params?: IParams) => {
  return productAxios.get<unknown, IProductsListResponse>(
    `/product/search/${keyword}`,
    { params }
  );
};

// 📌 Lấy danh sách sản phẩm khuyến mãi
export const fetchBase = (quantity: number) => {
  return productAxios.get<unknown, IProductsListResponse>("/product/sale", {
    params: { quantity },
  });
};

// 📌 Lọc sản phẩm nâng cao
export const fetchProductFilter = (params: Ref<IParams>) => {
  return productAxios.get<unknown, IProductsListResponse>("/product/get-all", {
    params: params.value,
  });
};

