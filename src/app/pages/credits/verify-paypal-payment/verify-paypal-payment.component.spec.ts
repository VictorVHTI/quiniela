import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPaypalPaymentComponent } from './verify-paypal-payment.component';

describe('VerifyPaypalPaymentComponent', () => {
  let component: VerifyPaypalPaymentComponent;
  let fixture: ComponentFixture<VerifyPaypalPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyPaypalPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyPaypalPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
