import api from "./api";

export interface CheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
  order_id: string;
  total: number;
  currency: string;
}

export interface SessionStatusResponse {
  status: string;
  order: any;
}

export const paymentService = {
  async createCheckoutSession(orderPayload: any): Promise<CheckoutSessionResponse> {
    const res = await api.post<CheckoutSessionResponse>("/payments/create-checkout-session", orderPayload);
    return res.data;
  },

  async getSessionStatus(sessionId: string): Promise<SessionStatusResponse> {
    const res = await api.get<SessionStatusResponse>(`/payments/session/${sessionId}`);
    return res.data;
  },
};

export default paymentService;

