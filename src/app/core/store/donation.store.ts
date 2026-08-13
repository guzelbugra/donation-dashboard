import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Campaign } from '../models/campaign.model';
import { CreateDonationDto, Donation } from '../models/donation.model';
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
  order: 'asc' | 'desc';
  isCampaignLoading: boolean;
  isDonationsLoading: boolean;
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
  isCampaignLoading: false,
  isDonationsLoading: false,
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
      const fetchCampaign = rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isCampaignLoading: true })),
          switchMap(() =>
            campaignService.getCampaign().pipe(
              tap({
                next: (campaign) => {
                  patchState(store, { campaign, isCampaignLoading: false });
                },
                error: (err) => {
                  console.error('Campaign load error:', err);
                  patchState(store, { isCampaignLoading: false });
                },
              }),
            ),
          ),
        ),
      );

      const fetchDonations = rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isDonationsLoading: true })),
          switchMap(() =>
            donationService
              .getDonations({
                page: store.page(),
                limit: store.limit(),
                sort: store.sort(),
                order: store.order(),
              })
              .pipe(
                tap({
                  next: (res) => {
                    patchState(store, {
                      donations: res.data,
                      page: res.pagination.page,
                      limit: res.pagination.limit,
                      total: res.pagination.total,
                      totalPages: res.pagination.totalPages,
                      isDonationsLoading: false,
                    });
                  },
                  error: (err) => {
                    console.error('Donations load error:', err);
                    patchState(store, { isDonationsLoading: false });
                  },
                }),
              ),
          ),
        ),
      );

      const createDonation = rxMethod<CreateDonationDto>(
        pipe(
          tap(() => patchState(store, { isDonationsLoading: true })),
          switchMap((newDonation) =>
            donationService
              .createDonation({
                ...newDonation,
                currency: newDonation.currency ?? 'EUR',
              })
              .pipe(
                tap({
                  next: () => {
                    fetchDonations();
                    fetchCampaign();
                  },
                  error: (err) => {
                    console.error('Create donation error:', err);
                    patchState(store, { isDonationsLoading: false });
                  },
                }),
              ),
          ),
        ),
      );

      return {
        loadCampaign() {
          fetchCampaign();
        },
        loadDonations() {
          fetchDonations();
        },
        setPage(page: number) {
          if (store.isDonationsLoading()) return;
          patchState(store, { page });
          fetchDonations();
        },
        setSorting(sort: string) {
          if (store.isDonationsLoading()) return;
          const newOrder =
            store.sort() === sort && store.order() === 'desc' ? 'asc' : 'desc';
          patchState(store, { sort, order: newOrder, page: 1 });
          fetchDonations();
        },
        createDonation(donation: CreateDonationDto) {
          createDonation(donation);
        },
      };
    },
  ),
);
