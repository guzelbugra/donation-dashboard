import { Component, OnInit, inject } from '@angular/core';
import { DonationStore } from './core/store/donation.store';
import { GenericTableComponent } from './shared/components/generic-table/generic-table.component';
import { ColumnDef } from './shared/models/table.model';
import { Donation } from './core/models/donation.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  readonly store = inject(DonationStore);

  donationColumns: ColumnDef<Donation>[] = [
    { key: 'donorName', header: 'Donor Name', sortable: true },
    {
      key: 'email',
      header: 'Email',
      sortable: false,
    },
    {
      key: 'paymentMethod',
      header: 'Payment Method',
      sortable: true,
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      cell: (row) => `${row.amount} ${row.currency}`,
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  ngOnInit(): void {
    this.store.loadCampaign();
    this.store.loadDonations();
  }
}
