import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campaign } from '../models/campaign.model';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private http = inject(HttpClient);
  private apiUrl = '/api/campaign';

  getCampaign(): Observable<Campaign> {
    return this.http.get<Campaign>(this.apiUrl);
  }
}
