import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { Campaign } from '../models/campaign.model';
import { DonationsApiResponse } from '../models/donation.model';

const MOCK_CAMPAIGN: Campaign = {
  id: 'camp_001',
  name: 'Save the Rainforest 2026',
  goal: 50000,
  totalRaised: 32450,
  donorCount: 847,
  startDate: '2026-01-01',
  endDate: '2026-03-31',
};

const MOCK_DONATIONS: DonationsApiResponse = {
  data: [
    {
      id: 'don_001',
      donorName: 'Maria Schmidt',
      email: 'maria@example.com',
      amount: 50,
      currency: 'EUR',
      paymentMethod: 'card',
      createdAt: '2026-01-15T14:32:00Z',
    },
    {
      id: 'don_002',
      donorName: 'Hans Müller',
      email: 'hans@example.com',
      amount: 100,
      currency: 'EUR',
      paymentMethod: 'paypal',
      createdAt: '2026-01-16T10:15:00Z',
    },
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
  },
};

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.endsWith('/api/campaign') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: MOCK_CAMPAIGN })).pipe(
      delay(300),
    );
  }

  if (req.url.includes('/api/donations') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: MOCK_DONATIONS })).pipe(
      delay(300),
    );
  }

  return next(req);
};
