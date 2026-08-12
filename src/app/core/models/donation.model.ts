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

export interface CreateDonationPayload {
  donorName: string;
  email: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DonationsApiResponse {
  data: Donation[];
  pagination: Pagination;
}
