import { Component, OnInit } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import {NewsService} from '../../core/services/news.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
list = [];
  constructor(public newsSvc: NewsService) { }

  ngOnInit() {
    this.newsSvc.fakeRequest().subscribe(resp => {
    this.list = resp;
    });
  }
  public captureScreen() {
  // const data = document.getElementById('contentToConvert');
  // html2canvas(data).then(canvas => {
  // // Few necessary setting options
  // let imgWidth = 208;
  // let pageHeight = 295;
  // let imgHeight = canvas.height * imgWidth / canvas.width;
  // let heightLeft = imgHeight;

  // const contentDataURL = canvas.toDataURL('image/png')
  // let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
  // let newpdf = new jspdf('p', 'pt', 'a4', true);
  // let position = 0;
  // newpdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  // newpdf.save('MYPdf.pdf'); // Generated PDF
  // });
  // }

  const pdf = new jspdf('p', 'pt', 'a4');
  pdf.addHTML(document.getElementById('contentToConvert'), function() {
    pdf.save('web.pdf');
  });

}
}

