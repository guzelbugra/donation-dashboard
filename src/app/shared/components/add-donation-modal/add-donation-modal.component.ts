import {
  Component,
  ElementRef,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  ChangeDetectionStrategy,
  inject,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CreateDonationDto,
  PaymentMethod,
} from '../../../core/models/donation.model';

@Component({
  selector: 'app-add-donation-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-donation-modal.component.html',
  styleUrl: './add-donation-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDonationModalComponent implements OnChanges {
  @ViewChild('dialog') dialogRef!: ElementRef<HTMLDialogElement>;

  @Input() isSubmitting = false;
  @Input() errorMessage: string | null = null;

  @Output() submitDonation = new EventEmitter<CreateDonationDto>();
  @Output() modalClosed = new EventEmitter<void>();

  private fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    donorName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    amount: [10, [Validators.required, Validators.min(1)]],
    paymentMethod: ['card' as PaymentMethod, [Validators.required]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSubmitting']) {
      if (this.isSubmitting) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
  }

  open() {
    this.dialogRef.nativeElement.showModal();
  }

  close() {
    this.dialogRef.nativeElement.close();
    this.form.reset({
      donorName: '',
      email: '',
      amount: 10,
      paymentMethod: 'card' as PaymentMethod,
    });
    this.modalClosed.emit();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const donationData: CreateDonationDto = this.form.getRawValue();
    this.submitDonation.emit(donationData);
  }
}
