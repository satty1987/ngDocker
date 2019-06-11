import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../core/services/news.service';
import { FormControl } from '@angular/forms';
import {COUNTRYCODE} from '../../core/constants/countrycode';
import * as _ from 'lodash';
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  sourceView: any;
  sorting = new FormControl();
  filterCountries: any;
  sourceClone: any;
 codeList = COUNTRYCODE;
 panelOpenState = false;

  constructor(public newsSvc: NewsService) { }

  ngOnInit() {

    if (history.state) {
    console.log(history.state);
    }
    this.newsSvc.getNewsSources().subscribe((response: any) => {
      console.log(response);
      this.sourceView = response.sources;
      this.sourceClone = response.sources;
      this.filterCountries = _.uniq(_.map(response.sources, 'country'));
      this.filterCountries  = _.map(this.filterCountries , (item) => {
        return item.toUpperCase();
       });
    });
  }

  sortingNews() {
this.sourceView = _.filter(this.sourceClone, {country : _.lowerCase(this.sorting.value) } );
  }

}
