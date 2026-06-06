export interface ProductColor {
  name: string;
  hex: string;
  images: string[];
}

export interface ProductStorage {
  size: string;
  price: string;
}

export interface ProductFeature {
  title: string;
  description: string;
  icon: string;
}

export interface ProductReview {
  name: string;
  rating: number;
  comment: string;
}

export interface ProductSpecifications {
  finish?: string;
  capacity?: string;
  display?: string;
  chip?: string;
}

export interface Product {
  id: string;

  title: string;
  subtitle?: string;
  price: string;

  imageSrc: string;
  imageAlt?: string;

  colors: ProductColor[];
  storage: ProductStorage[];
  features: ProductFeature[];

  specifications?: ProductSpecifications;
  reviews: ProductReview[];

  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  title: string;
  subtitle?: string;
  price: string;
  imageSrc: string;
  imageAlt?: string;

  colors?: ProductColor[];
  storage?: ProductStorage[];
  features?: ProductFeature[];
  specifications?: ProductSpecifications;
  reviews?: ProductReview[];
}

export interface ProductUpdate {
  title?: string;
  subtitle?: string;
  price?: string;
  imageSrc?: string;
  imageAlt?: string;

  colors?: ProductColor[];
  storage?: ProductStorage[];
  features?: ProductFeature[];
  specifications?: ProductSpecifications;
  reviews?: ProductReview[];
}