import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { CampaignService } from '../services/campaign.service';
import { DonationService } from '../services/donation.service';
import { initialDonationState } from './donation.state';

export const DonationStore = signalStore(
  { providedIn: 'root' },
  withState(initialDonationState),
  withMethods(
    (
      store,
      campaignService = inject(CampaignService),
      donationService = inject(DonationService),
    ) => ({
      loadCampaign(): void {
        campaignService.getCampaign().subscribe({
          next: (campaign) => patchState(store, { campaign }),
          error: (err) => console.error(err),
        });
      },

      loadDonations(): void {
        donationService.getDonations().subscribe({
          next: (res) => patchState(store, { donations: res.data }),
          error: (err) => console.error(err),
        });
      },
    }),
  ),
);
