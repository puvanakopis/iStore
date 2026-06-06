export interface WishlistItem {
  product_id: string;
  title: string;
  price: string;
  imageSrc: string;
  imageAlt?: string;
}

export interface Wishlist {
  id?: string;
  user_id: string;
  items: WishlistItem[];
  created_at: string;
  updated_at: string;
}
