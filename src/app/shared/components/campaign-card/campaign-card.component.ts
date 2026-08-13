import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Campaign } from '../../../core/models/campaign.model';

@Component({
  selector: 'app-campaign-card',
  standalone: true,
  imports: [CurrencyPipe, PercentPipe],
  templateUrl: './campaign-card.component.html',
  styleUrl: './campaign-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignCardComponent {
  @Input() campaign: Campaign | null = null;
  @Input() loading: boolean = false;

  get progressPercentage(): number {
    if (!this.campaign?.goal) return 0;
    const progress = (this.campaign.totalRaised / this.campaign.goal) * 100;
    return Math.min(progress, 100);
  }

  get percentageValue(): number {
    if (!this.campaign?.goal) return 0;
    return this.campaign.totalRaised / this.campaign.goal;
  }

  get inspiringMessage(): string {
    const percent = this.progressPercentage;
    if (percent >= 100) {
      return '🎉 Goal reached! Thank you for your incredible support!';
    } else if (percent >= 75) {
      return "🚀 Almost there! We're so close to reaching our goal!";
    } else if (percent >= 50) {
      return '💪 Halfway there! Keep the momentum going!';
    } else if (percent > 0) {
      return "🌱 Every contribution counts! Let's reach our target together.";
    }
    return '✨ Be the first to donate and kickstart this campaign!';
  }
}
