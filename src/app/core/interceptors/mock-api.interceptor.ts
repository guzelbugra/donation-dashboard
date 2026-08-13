import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { Campaign } from '../models/campaign.model';
import { Donation, PaginatedResponse } from '../models/donation.model';

const mockCampaign: Campaign = {
  id: 'camp_001',
  name: 'Save the Rainforest 2026',
  goal: 50000,
  totalRaised: 32450,
  donorCount: 847,
  startDate: '2026-01-01',
  endDate: '2026-03-31',
};

const mockDonations: Donation[] = Array.from({ length: 55 }, (_, i) => ({
  id: `don_${String(i + 1).padStart(3, '0')}`,
  donorName: `Donor ${i + 1}`,
  email: `donor${i + 1}@example.com`,
  amount: (i + 1) * 15,
  currency: 'EUR',
  paymentMethod: i % 2 === 0 ? 'card' : 'paypal',
  createdAt: new Date(2026, 0, 15 - i).toISOString(),
}));

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url === '/api/campaign' && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: mockCampaign })).pipe(
      delay(1000),
    );
  }

  if (req.url.startsWith('/api/donations') && req.method === 'GET') {
    const page = Number(req.params.get('page')) || 1;
    const limit = Number(req.params.get('limit')) || 10;
    const sort = req.params.get('sort') || 'createdAt';
    const order = req.params.get('order') || 'desc';

    let sorted = [...mockDonations];
    sorted.sort((a, b) => {
      let valA = a[sort as keyof Donation];
      let valB = b[sort as keyof Donation];

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    const startIndex = (page - 1) * limit;
    const paginatedData = sorted.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(mockDonations.length / limit);

    const response: PaginatedResponse<Donation> = {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: mockDonations.length,
        totalPages,
      },
    };

    return of(new HttpResponse({ status: 200, body: response })).pipe(
      delay(500),
    );
  }

  return next(req);
};
