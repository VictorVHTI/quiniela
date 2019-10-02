import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// facebook Login
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NewsComponent } from './pages/news/news.component';
import { QuinielaDetailsComponent } from './pages/quiniela-details/quiniela-details.component';
import { QuinielaTableComponent } from './pages/quiniela-details/quiniela-table/quiniela-table.component';
import { FillForecastComponent } from './pages/fill-forecast/fill-forecast.component';
import { CreditsComponent } from './pages/credits/credits.component';

// Paypal
import { NgxPayPalModule } from 'ngx-paypal';
import { VerifyPaypalPaymentComponent } from './pages/credits/verify-paypal-payment/verify-paypal-payment.component';
import { QuinielaAdminComponent } from './pages/quiniela-details/quiniela-admin/quiniela-admin.component';
import { AddMemberComponent } from './pages/quiniela-details/add-member/add-member.component';
import { ConfirmDialog } from './pages/confirm-dialog/confirm-dialog';


let config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("1854625554785635")
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NewsComponent,
    QuinielaDetailsComponent,
    QuinielaTableComponent,
    FillForecastComponent,
    CreditsComponent,
    VerifyPaypalPaymentComponent,
    QuinielaAdminComponent,
    AddMemberComponent,
    ConfirmDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressBarModule,
    MatDialogModule,
    MatRippleModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocialLoginModule,
    NgxPayPalModule
  ],
  providers: [{
    provide: AuthServiceConfig,
    useFactory: provideConfig
  }],
  bootstrap: [AppComponent],
  entryComponents: [
    FillForecastComponent,
    VerifyPaypalPaymentComponent,
    AddMemberComponent,
    ConfirmDialog
  ]
})
export class AppModule { }
