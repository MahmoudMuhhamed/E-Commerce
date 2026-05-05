export interface ProductCategory {
  _id?: string;
  name?: string;
  slug?: string;
}

export interface ProductBrand {
  _id?: string;
  name?: string;
  slug?: string;
  image?: string;
}

export interface Product {
  _id?: string;
  id?: string | number;
  name?: string;
  title: string;
  slug?: string;
  description?: string;
  price: number;
  priceAfterDiscount?: number;
  originalPrice?: number;
  image?: string;
  imageCover?: string;
  images?: string[];
  quantity?: number;
  inStock?: boolean;
  ratingsAverage?: number;
  rating?: number;
  ratingsQuantity?: number;
  reviews?: number;
  category?: string | ProductCategory;
  brand?: string | ProductBrand;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export function getProductId(product: Product) {
  return product.id ?? product._id ?? '';
}
