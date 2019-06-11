import { Component, OnInit } from '@angular/core';
import {OktaAuthService} from '../../core/services/okta-auth.service';
import {ActivatedRoute} from '@angular/router';
import { API_URLS } from '../../core/constants/api-urls';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
showDropdown = false;
category = API_URLS.category;
value ;
isSearchEnable = false;
  constructor(public _OktaAuthService: OktaAuthService, public router: ActivatedRoute) { }

  ngOnInit() {

  }
  toggle() {
    this.showDropdown = !this.showDropdown;
  }
  showSearch() {
this.isSearchEnable = ! this.isSearchEnable;
  }

}
