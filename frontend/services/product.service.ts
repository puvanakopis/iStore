import api from "./api";
import {
  Product,
  ProductCreate,
  ProductUpdate,
  SearchResponse,
} from "../interfaces/product.interface";

const mapProduct = (p: any): Product => ({
  ...p,
  id: p.id || p._id || "",
});

export const productService = {
  async getAll(skip: number = 0, limit: number = 100): Promise<Product[]> {
    const res = await api.get<any[]>(`/products/?skip=${skip}&limit=${limit}`);
    return res.data.map(mapProduct);
  },

  async search(query: string, limit: number = 10): Promise<SearchResponse> {
    const res = await api.get<SearchResponse>(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return res.data;
  },

  async getRecommendations(productId: string, limit: number = 5): Promise<Product[]> {
    const res = await api.get<any[]>(`/products/recommendations/${productId}?limit=${limit}`);
    return res.data.map(mapProduct);
  },

  async getTrending(limit: number = 6): Promise<Product[]> {
    const res = await api.get<any[]>(`/products/trending?limit=${limit}`);
    return res.data.map(mapProduct);
  },

  async getById(id: string): Promise<Product> {
    const res = await api.get<any>(`/products/${id}`);
    return mapProduct(res.data);
  },

  async create(data: ProductCreate): Promise<Product> {
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

  async upload(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post<{ url: string }>("/products/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error("Admin access required to upload images");
      }
      if (error.response?.status === 401) {
        throw new Error("Please login to upload images");
      }
      throw error;
    }
  },

  async toggleLike(productId: string): Promise<{ liked: boolean }> {
    const res = await api.post<{ liked: boolean }>(`/products/${productId}/like`);
    return res.data;
  },

  async checkLikeStatus(productId: string): Promise<{ liked: boolean }> {
    const res = await api.get<{ liked: boolean }>(`/products/${productId}/like`);
    return res.data;
  },
};