import { TestBed } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DonationService } from './donation.service';
import {
  CreateDonationDto,
  Donation,
  DonationQueryParams,
  PaginatedResponse,
} from '../models/donation.model';

describe('DonationService', () => {
  let service: DonationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DonationService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(DonationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDonations', () => {
    it('should issue a GET request with default pagination parameters', () => {
      const mockQueryParams: DonationQueryParams = {
        page: 1,
        limit: 10,
      };

      const mockResponse: PaginatedResponse<Donation> = {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };

      service.getDonations(mockQueryParams).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        (request) =>
          request.url === '/api/donations' &&
          request.params.get('page') === '1' &&
          request.params.get('limit') === '10' &&
          !request.params.has('sort') &&
          !request.params.has('order'),
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should include sort and order query params when provided', () => {
      const mockQueryParams: DonationQueryParams = {
        page: 2,
        limit: 5,
        sort: 'amount',
        order: 'desc',
      };

      const mockResponse: PaginatedResponse<Donation> = {
        data: [],
        pagination: {
          page: 2,
          limit: 5,
          total: 0,
          totalPages: 0,
        },
      };

      service.getDonations(mockQueryParams).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        (request) =>
          request.url === '/api/donations' &&
          request.params.get('page') === '2' &&
          request.params.get('limit') === '5' &&
          request.params.get('sort') === 'amount' &&
          request.params.get('order') === 'desc',
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return a populated list of donations', () => {
      const mockQueryParams: DonationQueryParams = { page: 1, limit: 2 };

      const mockResponse: PaginatedResponse<Donation> = {
        data: [
          {
            id: 'don_1',
            donorName: 'Jane Doe',
            email: 'jane@example.com',
            amount: 50,
            currency: 'EUR',
            paymentMethod: 'card',
            createdAt: '2026-03-30T10:00:00Z',
          },
          {
            id: 'don_2',
            donorName: 'John Smith',
            email: 'john@example.com',
            amount: 100,
            currency: 'EUR',
            paymentMethod: 'paypal',
            createdAt: '2026-03-30T11:00:00Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 2,
          total: 2,
          totalPages: 1,
        },
      };

      service.getDonations(mockQueryParams).subscribe((response) => {
        expect(response.data.length).toBe(2);
        expect(response.data[0].donorName).toBe('Jane Doe');
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((r) => r.url === '/api/donations');
      req.flush(mockResponse);
    });
  });

  describe('createDonation', () => {
    it('should issue a POST request with the required payload', () => {
      const mockDto: CreateDonationDto = {
        donorName: 'John Doe',
        email: 'john@example.com',
        amount: 100,
        currency: 'EUR',
        paymentMethod: 'card',
      };

      const mockCreatedDonation: Donation = {
        id: '123',
        createdAt: '2026-03-30T10:00:00Z',
        donorName: mockDto.donorName,
        email: mockDto.email,
        amount: mockDto.amount,
        currency: mockDto.currency ?? 'EUR',
        paymentMethod: mockDto.paymentMethod,
      };

      service.createDonation(mockDto).subscribe((response) => {
        expect(response).toEqual(mockCreatedDonation);
      });

      const req = httpMock.expectOne('/api/donations');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockDto);

      req.flush(mockCreatedDonation);
    });

    it('should handle HTTP error when createDonation fails', () => {
      const mockDto: CreateDonationDto = {
        donorName: 'John Doe',
        email: 'john@example.com',
        amount: 0,
        paymentMethod: 'card',
      };

      service.createDonation(mockDto).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
        },
      });

      const req = httpMock.expectOne('/api/donations');
      req.flush('Invalid donation amount', {
        status: 400,
        statusText: 'Bad Request',
      });
    });
  });
});
