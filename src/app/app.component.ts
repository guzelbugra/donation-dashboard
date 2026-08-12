import { Component, OnInit, inject } from '@angular/core';
import { DonationStore } from './core/store/donation.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  readonly store = inject(DonationStore);

  ngOnInit(): void {
    this.store.loadCampaign();
    this.store.loadDonations();
  }
}
