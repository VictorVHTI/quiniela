import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  _config = {

    ENV: 'QA',

    version: '1.0.0',

    LOCAL: {
      API: 'http://localhost:2800',
    },
    QA: {
      API: 'https://qa-quinielapro.herokuapp.com'
    },
    PROD: {
      API: 'https://quinielapro.herokuapp.com',
    }

  };

  constructor(private http: HttpClient) { }

  config(KEY) {
    if (KEY === 'version') {
      return this._config[KEY];
    }
    return this._config[this._config.ENV][KEY]
  }

  private get(url: string) {
    return this.http.get(this.config('API') + url, { headers: new HttpHeaders({ 'x-access-token': localStorage.getItem('token') }) });
  }

  private post(url: string, params: any) {
    if (localStorage.token) {
      return this.http.post(this.config('API') + url, params, { headers: new HttpHeaders({ 'x-access-token': localStorage.token }) });
    } else {
      return this.http.post(this.config('API') + url, params);
    }

  }

  /** Profile */
  login(data): any {
    return this.post('/login', data);
  }

  myProfile(): any {
    return this.get('/profile/me');
  }

  // settings
  settings(setting: string): any {
    return this.get('/settings/details/' + setting);
  }

  /** Credist */
  myCredits(): any {
    return this.get('/credits/mycredits');
  }

  creditsPrices(): any {
    return this.get('/credits/prices');
  }

  verifyPaypalPayment(data: any): any {
    return this.post('/verify/paypal/payment', data);
  }

  /** News */
  getNews(): any {
    return this.get('/news/all');
  }

  /** Quiniela endpoints */
  imin(showArchived): any {
    let url = '/quiniela/imin/' + showArchived;
    return this.get(url);
  }

  quinielaDetails(id: string): any {
    let url = '/quiniela/details/' + id;
    return this.get(url);
  }

  saveForecast(data: any): any {
    let url = '/quiniela/myForecast/';
    return this.post(url, data);
  }

  starMember(id: string): any {
    let url = '/quiniela/starMember';
    let data = { id: id };
    return this.post(url, data);
  }

  myProfiles(): any {
    let url = '/groups/myProfiles';
    return this.get(url);
  }

  deleteProfile(profile_id): any {
    let url = '/groups/deleteP/' + profile_id;
    return this.post(url, {});
  }

  addMembersToQuiniela(data): any {
    let url = '/groups/addGroupMembers';
    return this.post(url, data);
  }
  /* Ends quiniela end points */

  /* groups */
  createProfile(profile: any): any {
    return this.post('/groups/createProfile', profile);
  }

}
