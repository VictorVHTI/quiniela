import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../../../providers/api/api.service';

@Component({
  selector: 'app-verify-paypal-payment',
  templateUrl: './verify-paypal-payment.component.html',
  styleUrls: ['./verify-paypal-payment.component.scss']
})
export class VerifyPaypalPaymentComponent implements OnInit {

  verifying: boolean = true;
  verified: boolean = false;
  error: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.api.verifyPaypalPayment(this.data)
        .subscribe(res => {
          this.verifying = false;
          if (res.success) {
            this.verified = true;
          } else {
            this.error = true;
          }
        }, err => {
          this.error = true;
        })
    }, 200)
  }

}
