import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateDonationDto,
  Donation,
  DonationQueryParams,
  PaginatedResponse,
} from '../models/donation.model';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private readonly apiUrl = '/api/donations';

  constructor(private http: HttpClient) {}

  getDonations(
    params: DonationQueryParams,
  ): Observable<PaginatedResponse<Donation>> {
    let httpParams = new HttpParams()
      .set('page', params.page)
      .set('limit', params.limit);

    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }
    if (params.order) {
      httpParams = httpParams.set('order', params.order);
    }

    return this.http.get<PaginatedResponse<Donation>>(this.apiUrl, {
      params: httpParams,
    });
  }

  createDonation(donation: CreateDonationDto): Observable<Donation> {
    return this.http.post<Donation>(this.apiUrl, donation);
  }
}
