import { Injectable } from '@angular/core';
import { ApiService } from './api/api.service';

import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  session: Subject<string>;

  constructor(private api: ApiService) {
    this.session = new Subject<string>()
  }

  login(data: any): any {
    return new Promise((resolve, reject) => {
      data.id = data.id || data.password;
      this.api.login(data)
        .subscribe((res) => {
          if (res.success) {
            /** store token returned */
            localStorage.setItem("token", res.token);
            /** store profile */
            localStorage.setItem("profile", JSON.stringify(res.data));

            this.session.next('active');

            return resolve(res);
          }
          return resolve(res);
        })
    });
  }

  verifyToken(t: string) {
    return new Promise((resolve, reject) => {
      localStorage.setItem('token', t);
      this.api.myProfile()
        .subscribe(res => {
          if (res.success) {
            localStorage.setItem('profile', JSON.stringify(res.data));
            this.session.next('active');
            return resolve();
          } else {
            localStorage.removeItem('token');
            return reject();
          }
        }, () => {
          localStorage.removeItem('token');
          reject();
        });
    });
  }

  logout() {
    for (var key in localStorage) {
      localStorage.removeItem(key);
    }
    this.session.next('inactive');
  }

  sessionListener(): Subject<string> {
    return this.session;
  }


}
