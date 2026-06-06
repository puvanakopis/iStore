import api from "./api";
import { Wishlist, WishlistItem } from "../interfaces/wishlist.interface";

export const wishlistService = {
  async get(): Promise<Wishlist> {
    const res = await api.get<Wishlist>("/wishlist/");
    return res.data;
  },

  async add(item: WishlistItem): Promise<Wishlist> {
    const res = await api.post<Wishlist>("/wishlist/add", item);
    return res.data;
  },

  async remove(productId: string): Promise<Wishlist> {
    const res = await api.post<Wishlist>("/wishlist/remove", { product_id: productId });
    return res.data;
  },

  async clear(): Promise<Wishlist> {
    const res = await api.delete<Wishlist>("/wishlist/clear");
    return res.data;
  },
};
