import api from "./api";
import {
  Product,
  ProductCreate,
  ProductUpdate,
} from "../interfaces/product.interface";

const mapProduct = (p: any): Product => ({
  ...p,
  id: p.id || p._id || "",
});

export const productService = {
  async getAll(): Promise<Product[]> {
    const res = await api.get<any[]>("/products/");
    return res.data.map(mapProduct);
  },

  async getById(id: string): Promise<Product> {
    const res = await api.get<any>(`/products/${id}`);
    return mapProduct(res.data);
  },

  async create(data: ProductCreate): Promise<Product> {
    // This will automatically include the token via the api interceptor
    // But we need to handle 403 errors properly
    try {
      const res = await api.post<any>("/products/", data);
      return mapProduct(res.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error("Admin access required to create products");
      }
      if (error.response?.status === 401) {
        throw new Error("Please login to create products");
      }
      throw error;
    }
  },

  async update(id: string, data: ProductUpdate): Promise<Product> {
    try {
      const res = await api.put<any>(`/products/${id}`, data);
      return mapProduct(res.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error("Admin access required to update products");
      }
      if (error.response?.status === 401) {
        throw new Error("Please login to update products");
      }
      throw error;
    }
  },

  async remove(id: string): Promise<{ msg: string }> {
    try {
      const res = await api.delete<{ msg: string }>(`/products/${id}`);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error("Admin access required to delete products");
      }
      if (error.response?.status === 401) {
        throw new Error("Please login to delete products");
      }
      throw error;
    }
  },
};