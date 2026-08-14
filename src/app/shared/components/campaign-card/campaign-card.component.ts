import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
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
  @Input() progressPercentage: number = 0;
  @Input() averageDonation: number = 0;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Output() retry = new EventEmitter<void>();

  get percentageValue(): number {
    return this.progressPercentage / 100;
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
