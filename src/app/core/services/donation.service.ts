import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Donation,
  DonationsApiResponse,
  CreateDonationPayload,
} from '../models/donation.model';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private http = inject(HttpClient);
  private apiUrl = '/api/donations';

  getDonations(
    page = 1,
    limit = 10,
    sort = 'date',
    order = 'desc',
  ): Observable<DonationsApiResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);

    return this.http.get<DonationsApiResponse>(this.apiUrl, { params });
  }

  createDonation(payload: CreateDonationPayload): Observable<Donation> {
    return this.http.post<Donation>(this.apiUrl, payload);
  }
}
