import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { LoginService } from '../../providers/login.service';

import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  frames: Array<string> = ["/assets/imgs/iphone_frame_qp.png", "/assets/imgs/iphone_frame_qp_news.png"];
  currentFrame: string = this.frames[0];

  loging: boolean = false;

  loginForm = new FormGroup({
    'email': new FormControl('', [
      Validators.required,
      Validators.email,
    ]),

    'password': new FormControl('', [
      Validators.required
    ])

  });


  constructor(
    private loginService: LoginService,
    private snack: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {

    if (localStorage.token) {
      this.router.navigate(['/dashboard']);
    }

    this.route.paramMap.subscribe((res) => {
      if (res.get('pt')) {
        this.location.replaceState('/login');
        this.loging = true;
        this.loginService.verifyToken(res.get('pt'))
          .then(() => {
            this.loging = false;
            this.router.navigate(['/dashboard']);
          }, () => {
            this.loging = false;
          })

      }
    })

    let framePos = 0;
    setInterval(() => {
      framePos = this.frames.length - 1 === framePos ? 0 : framePos + 1;
      this.currentFrame = this.frames[framePos];
    }, 3000);
  }

  login(user?) {
    this.loging = true;
    let payload = user || this.loginForm.value;
    this.loginService.login(payload)
      .then((res) => {
        this.loging = false;
        if (res.success) {
          this.router.navigate(['/dashboard']);
        }
        else {
          this.snack.open("Email y/o contraseña incorrectos", '', { duration: 2000 });
        }
      })
  }

  fbLogin() {
    this.loging = true;
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((user) => {
        this.authService.signOut();
        this.login(user);
      }, () => { this.loging = false; })
  }

}
