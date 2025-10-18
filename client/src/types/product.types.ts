export interface IProduct {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brandName: string;
  slug: string;
  categoryName?: string;
  thumbUrl?: string;
  images?: IProductImage[];
  productSpecs?: IProductSpec[],
  productVariants?: IProductVariant[]
}

export interface ISpecification {
  id: number,
  specName: string
}

export interface IProductSpec {
  specification?: ISpecification,
  specValue?: string
}
export interface IParams {
  page?: number;
  limit?: number;
  skip?: number;
  select?: string;
  order?: string,
  dir?: string,
  brand?: string
}


export interface IProductsListResponse {
  products: IProduct[];
  total: number;
  skip: number;
  limit: number;
  page: number
}
export interface IColor {
  id: number,
  name?: string,
  code?: string
}
export interface IMemory {
  id: number,
  ram?: string,
  rom?: string,
  chipset?: string
}
export interface IProductVariant {
  id: number,
  stock?: number,
  price?: number,
  color?: IColor,
  memory?: IMemory,
  product?: IProduct
}

export interface IProductImage {
  id: number | string;
  _id?: string; // Thêm dòng này để dùng làm key cho Swiper
  colorId?: number | string; // Thêm dòng này để lọc ảnh theo màu
  name: string;
  imageUrl: string;
  originalName?: string;
  fileSize?: number;
}