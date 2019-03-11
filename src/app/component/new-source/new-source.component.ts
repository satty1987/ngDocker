import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../core/services/news.service';

@Component({
  selector: 'app-new-source',
  templateUrl: './new-source.component.html',
  styleUrls: ['./new-source.component.scss']
})
export class NewSourceComponent implements OnInit {
sourcesData: any = [];
  constructor(public route: ActivatedRoute, public newsSvc: NewsService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params.source);
      this.newsSvc.getDetailNewsSources(params.source).subscribe((data: any) => {
   this.sourcesData = data.articles;
      });
   });
  }

}

