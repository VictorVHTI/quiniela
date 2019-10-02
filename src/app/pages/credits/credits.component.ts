import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ApiService } from '../../providers/api/api.service';
import { VerifyPaypalPaymentComponent } from './verify-paypal-payment/verify-paypal-payment.component';

import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {
  myCredits: number;
  profile: any = JSON.parse(localStorage.profile);
  loadingCredits = false;
  prices: Array<any> = [];
  selectedCredits: any;
  payPalConfig?: PayPalConfig;

  constructor(private api: ApiService, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadMyCredits();
    this.loadPrices();
  }

  loadMyCredits() {
    this.api.myCredits()
      .subscribe((res) => {
        if (res.success) {
          this.myCredits = res.data;
        }
      })
  }

  loadPrices() {
    this.loadingCredits = true;
    this.api.creditsPrices()
      .subscribe(res => {
        this.loadingCredits = false;
        if (res.success) {
          this.prices = res.data;
        }
      })
  }

  selectCredits(credits) {
    setTimeout(() => {
      this.selectedCredits = credits;
      this.initPaypal();
    }, 250)
  }

  clear(){
    this.selectedCredits = undefined;
    this.payPalConfig = undefined;
  }

  private initPaypal(): void {
    this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Production, {
      commit: true,
      client: {
        sandbox: 'AUHq4Fbj5hctIlQSu-wNwQrgD_hw1X350xL3fmSxh_s_ZC86KF30H5yJZApgvset3f_MyqTZ5kEKsKlF',
        production: 'Aby8YS3mHzUUYN03HKWUMJcITo9DPA1VdTAImMzalFWt5GwY9mEQffVhEDydYBi3TpBk8uSxhNwv5qlQ'
      },
      button: {
        label: 'paypal',
        size: 'responsive',
        color: "blue"
      },
      onPaymentComplete: (data, actions) => {
        let verification = {
          paymentId: data.paymentID,
          cpId: this.selectedCredits._id,
          source: 'web_app'
        };

        const dialogRef = this.dialog.open(VerifyPaypalPaymentComponent, { data: verification });
        dialogRef.afterClosed().subscribe(() => {
          this.loadMyCredits();
          this.clear();
        });
      },
      onCancel: (data, actions) => {
        console.log('OnCancel');
      },
      onError: (err) => {
        console.log('OnError');
      },

      transactions: [{
        amount: {
          currency: 'MXN',
          total: this.selectedCredits.price,
        },
        description: 'Quiniela PRO: ' + this.selectedCredits.credits + ' créditos.'
      }]
    });
  }

}
