import {OktaAuthService} from '../../core/services/okta-auth.service';
import { interval } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FooterComponent } from '../footer/footer.component';

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public _oktaAuthService: OktaAuthService,
    public dialog: MatDialog) { }

  public intervallTimer = interval(300);
  public counter;
  public subscription;


  ngOnInit() {
    // this._oktaAuthService.getTmoAccess().subscribe((response) => {
    //   console.log(response);
    // });
    this.subscription = this.intervallTimer.subscribe((n) => {
    this.counter = n * n + 10;
    if (this.counter > 100) {
      this.counter = 100;
      this.subscription.unsubscribe();
      this.openDialog();
    }
    });
  }
  openDialog(): void {
   this.dialog.open(FooterComponent,
      {
        height: '600px',
        width: '980px',
    });
  }
loginWithOkta() {
  this._oktaAuthService.loginWithOkta();
}

}
