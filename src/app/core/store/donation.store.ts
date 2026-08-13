import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Campaign } from '../models/campaign.model';
import { Donation } from '../models/donation.model';
import { CampaignService } from '../services/campaign.service';
import { DonationService } from '../services/donation.service';

export interface DonationState {
  campaign: Campaign | null;
  donations: Donation[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  sort: string;
  loading: boolean;
  order: 'asc' | 'desc';
}

const initialState: DonationState = {
  campaign: null,
  donations: [],
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  sort: 'createdAt',
  order: 'desc',
  loading: false,
};

export const DonationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      campaignService = inject(CampaignService),
      donationService = inject(DonationService),
    ) => {
      const fetchDonations = rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() =>
            donationService
              .getDonations({
                page: store.page(),
                limit: store.limit(),
                sort: store.sort(),
                order: store.order(),
              })
              .pipe(
                tap((res) => {
                  patchState(store, {
                    donations: res.data,
                    page: res.pagination.page,
                    limit: res.pagination.limit,
                    total: res.pagination.total,
                    totalPages: res.pagination.totalPages,
                    loading: false,
                  });
                }),
              ),
          ),
        ),
      );

      return {
        loadCampaign() {
          campaignService.getCampaign().subscribe((campaign) => {
            patchState(store, { campaign });
          });
        },
        loadDonations() {
          fetchDonations();
        },
        setPage(page: number) {
          if (store.loading()) return;
          patchState(store, { page });
          fetchDonations();
        },
        setSorting(sort: string) {
          if (store.loading()) return;
          const newOrder =
            store.sort() === sort && store.order() === 'desc' ? 'asc' : 'desc';
          patchState(store, { sort, order: newOrder, page: 1 });
          fetchDonations();
        },
      };
    },
  ),
);
