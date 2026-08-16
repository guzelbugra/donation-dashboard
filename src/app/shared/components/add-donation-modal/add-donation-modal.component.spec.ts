import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDonationModalComponent } from './add-donation-modal.component';
import { CreateDonationDto } from '../../../core/models/donation.model';

describe('AddDonationModalComponent', () => {
  let component: AddDonationModalComponent;
  let fixture: ComponentFixture<AddDonationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDonationModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddDonationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    if (component.dialogRef?.nativeElement) {
      component.dialogRef.nativeElement.showModal = jest.fn();
      component.dialogRef.nativeElement.close = jest.fn();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization & Validation', () => {
    it('should initialize form with default values and invalid state', () => {
      expect(component.form.valid).toBeFalsy();
      expect(component.form.value.amount).toBe(10);
      expect(component.form.value.paymentMethod).toBe('card');
    });

    it('should validate required fields', () => {
      const donorNameControl = component.form.controls.donorName;
      const emailControl = component.form.controls.email;

      expect(donorNameControl.errors?.['required']).toBeTruthy();
      expect(emailControl.errors?.['required']).toBeTruthy();
    });

    it('should validate email format', () => {
      const emailControl = component.form.controls.email;
      emailControl.setValue('invalid-email');

      expect(emailControl.errors?.['email']).toBeTruthy();

      emailControl.setValue('valid@example.com');
      expect(emailControl.errors).toBeNull();
    });

    it('should validate minimum amount requirement', () => {
      const amountControl = component.form.controls.amount;
      amountControl.setValue(0);

      expect(amountControl.errors?.['min']).toBeTruthy();

      amountControl.setValue(5);
      expect(amountControl.errors).toBeNull();
    });
  });

  describe('Dialog Actions (open & close)', () => {
    it('should call showModal on native element when open() is invoked', () => {
      component.open();
      expect(component.dialogRef.nativeElement.showModal).toHaveBeenCalled();
    });

    it('should close dialog, reset form, and emit modalClosed on close()', () => {
      jest.spyOn(component.modalClosed, 'emit');

      component.form.controls.donorName.setValue('John Doe');
      component.close();

      expect(component.dialogRef.nativeElement.close).toHaveBeenCalled();
      expect(component.form.value.donorName).toBe('');
      expect(component.form.value.amount).toBe(10);
      expect(component.modalClosed.emit).toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should mark all controls as touched and not emit submitDonation when form is invalid', () => {
      jest.spyOn(component.submitDonation, 'emit');

      component.onSubmit();

      expect(component.form.touched).toBeTruthy();
      expect(component.submitDonation.emit).not.toHaveBeenCalled();
    });

    it('should emit submitDonation with raw form values when form is valid', () => {
      jest.spyOn(component.submitDonation, 'emit');

      const expectedPayload: CreateDonationDto = {
        donorName: 'Jane Doe',
        email: 'jane@example.com',
        amount: 50,
        paymentMethod: 'paypal',
      };

      component.form.setValue(expectedPayload);
      expect(component.form.valid).toBeTruthy();

      component.onSubmit();

      expect(component.submitDonation.emit).toHaveBeenCalledWith(
        expectedPayload,
      );
    });
  });
});
