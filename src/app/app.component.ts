import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './providers/login.service'
import { ApiService } from './providers/api/api.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  opened: boolean = window.innerWidth > 600;
  logged: boolean = false;
  profile: any = {};
  myCredits: number;
  constructor(
    private router: Router,
    private session: LoginService,
    private api: ApiService
  ) {

    // listen for changes on current session
    this.session.sessionListener().subscribe((data) => {
      if (data === 'active') {
        this.profile = JSON.parse(localStorage.getItem('profile'));
        this.logged = true;
        this.loadMyCredits();
      }
      else {
        this.logged = false;
      }
    });

    if(window.location.pathname.indexOf('login/t/') != -1){
      this.session.logout();
      return;
    }
    let token = localStorage.getItem("token");
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.logged = true;
    this.profile = JSON.parse(localStorage.getItem('profile'));
    this.loadMyCredits();
  }

  loadMyCredits() {
    this.api.myCredits()
      .subscribe((res) => {
        if(res.success){
          this.myCredits = res.data;
        }
      })
  }

  toogleMenu() {
    this.opened = !this.opened;
  }

  exit() {
    this.session.logout();
    this.router.navigate(["/login"]);
  }
}
