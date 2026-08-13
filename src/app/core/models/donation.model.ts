export type PaymentMethod = 'card' | 'paypal' | 'sepa';
export interface Donation {
  id: string;
  donorName: string;
  email: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateDonationPayload {
  donorName: string;
  email: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface DonationQueryParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}
