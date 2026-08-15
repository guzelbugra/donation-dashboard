import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { delay, of, switchMap, throwError, timer } from 'rxjs';
import { Campaign } from '../models/campaign.model';
import {
  CreateDonationDto,
  Donation,
  PaginatedResponse,
} from '../models/donation.model';

const mockCampaign: Campaign = {
  id: 'camp_001',
  name: 'Save the Rainforest 2026',
  goal: 50000,
  totalRaised: 32450,
  donorCount: 847,
  startDate: '2026-01-01',
  endDate: '2026-03-31',
};

const mockDonations: Donation[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `don_${String(i + 1).padStart(3, '0')}`,
  donorName: `Donor ${i + 1}`,
  email: `donor${i + 1}@example.com`,
  amount: (i + 1) * 15,
  currency: 'EUR',
  paymentMethod: i % 2 === 0 ? 'card' : 'paypal',
  createdAt: new Date(2026, 0, 15 - i).toISOString(),
}));

export let isCampaignErrorMode = false;
export let isDonationsErrorMode = false;
export let isCreateDonationErrorMode = false;

export const setCampaignErrorMode = (status: boolean) => {
  isCampaignErrorMode = status;
};

export const setDonationsErrorMode = (status: boolean) => {
  isDonationsErrorMode = status;
};

export const setCreateDonationErrorMode = (status: boolean) => {
  isCreateDonationErrorMode = status;
};

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url === '/api/campaign' && req.method === 'GET') {
    if (isCampaignErrorMode) {
      return timer(1000).pipe(
        switchMap(() =>
          throwError(
            () =>
              new HttpErrorResponse({
                status: 500,
                statusText: 'Internal Server Error',
                error: { message: 'Failed to load campaign statistics.' },
              }),
          ),
        ),
      );
    }

    return of(new HttpResponse({ status: 200, body: mockCampaign })).pipe(
      delay(1000),
    );
  }

  if (req.url.startsWith('/api/donations') && req.method === 'GET') {
    if (isDonationsErrorMode) {
      return timer(1000).pipe(
        switchMap(() =>
          throwError(
            () =>
              new HttpErrorResponse({
                status: 500,
                statusText: 'Internal Server Error',
                error: { message: 'Failed to load donations list.' },
              }),
          ),
        ),
      );
    }

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

  if (req.url === '/api/donations' && req.method === 'POST') {
    if (isCreateDonationErrorMode) {
      return timer(1000).pipe(
        switchMap(() =>
          throwError(
            () =>
              new HttpErrorResponse({
                status: 500,
                statusText: 'Internal Server Error',
                error: {
                  message: 'Failed to create new donation. Please try again.',
                },
              }),
          ),
        ),
      );
    }

    const body = req.body as CreateDonationDto;

    const newDonation: Donation = {
      id: `don_${String(mockDonations.length + 1).padStart(3, '0')}`,
      donorName: body.donorName,
      email: body.email,
      amount: Number(body.amount),
      currency: body.currency ?? 'EUR',
      paymentMethod: body.paymentMethod,
      createdAt: new Date().toISOString(),
    };

    mockDonations.unshift(newDonation);
    mockCampaign.totalRaised += newDonation.amount;
    mockCampaign.donorCount += 1;

    return of(new HttpResponse({ status: 201, body: newDonation })).pipe(
      delay(1000),
    );
  }

  return next(req);
};
