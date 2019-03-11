import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '../../core/services/okta-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-okta-callback',
  templateUrl: './okta-callback.component.html',
  styleUrls: ['./okta-callback.component.scss']
})
export class OktaCallbackComponent implements OnInit {

  constructor(public _OktaAuthService: OktaAuthService, public router: ActivatedRoute,
    public routing: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.router.queryParams.subscribe((params) => {
      console.log(params);
      if (params.code) {
        sessionStorage.setItem('oktaCode', params.code);
        this._OktaAuthService.getOktaToken(params.code).subscribe((response: any) => {
          sessionStorage.setItem('oktaAccessToken', response.access_token);
          this._OktaAuthService.getOktaUserProfile().subscribe((userInfo) => {
            console.log(userInfo);
            this.openSnackBar(`Welcome ${userInfo.name}`);
          }, err => {
            console.log(err);
          });
        }, err => {
          if (err.status === 400) {
            this._OktaAuthService.loginWithOkta();
          }
        });
      }

    });
  }
  openSnackBar(message: string) {
    const snackBarRef = this.snackBar.open(message, '×', {duration: 5000});
    snackBarRef.afterDismissed().subscribe(() => {
      console.log('The snack-bar was dismissed');
      this.routing.navigate(['home']);
    });
  }

}
