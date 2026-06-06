import api from "./api";
import {
  Product,
  ProductCreate,
  ProductUpdate,
} from "../interfaces/product.interface";

export const productService = {
  async getAll(): Promise<Product[]> {
    const res = await api.get<Product[]>("/products/");
    return res.data;
  },

  async getById(id: string): Promise<Product> {
    const res = await api.get<Product>(`/products/${id}`);
    return res.data;
  },

  async create(data: ProductCreate): Promise<Product> {
    const res = await api.post<Product>("/products/", data);
    return res.data;
  },

  async update(id: string, data: ProductUpdate): Promise<Product> {
    const res = await api.put<Product>(`/products/${id}`, data);
    return res.data;
  },

  async remove(id: string): Promise<{ msg: string }> {
    const res = await api.delete<{ msg: string }>(`/products/${id}`);
    return res.data;
  },
};