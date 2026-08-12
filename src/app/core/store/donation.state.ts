import { Campaign } from '../models/campaign.model';
import { Donation } from '../models/donation.model';

export interface DonationState {
  campaign: Campaign | null;
  donations: Donation[];
}

export const initialDonationState: DonationState = {
  campaign: null,
  donations: [],
};
