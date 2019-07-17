import { Component, OnInit } from '@angular/core';
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

  // const pdf = new jspdf('p', 'pt', 'a4');
  // pdf.addHTML(document.getElementById('contentToConvert'), function() {
  //   pdf.save('web.pdf');
  // });

}

private getStylings(): string {
  // tslint:disable-next-line:no-global-variables
  // const mydocument = document;
  let cssStyle: string = '';
  // tslint:disable-next-line:no-global-variables
  const documentLength = document.getElementsByTagName('style').length;
  for (let j = 0; j < documentLength; j++) {
    // tslint:disable-next-line:no-global-variables
    cssStyle += document.getElementsByTagName('style')[j].innerHTML;
  }
  return cssStyle;
}

private getPrintBody(idSelector: string): string {
  // tslint:disable-next-line:no-global-variables

  const htmlSelector = document.getElementById(idSelector).innerHTML;
  const body: string = '<html><head><style>'
    .concat('@media print {').concat(this.getStylings())
    .concat('* {-webkit-print-color-adjust: exact !important;color-adjust: exact !important;}')
    .concat('* {position: relative !important;}')
    .concat('*.printable {display: block !important;}')
    .concat('.page-break {page-break-before: always; display: block;}')
    .concat('}')
    .concat('</style></head><body class="ui-dialog">')
    .concat(htmlSelector)
    .concat('</body></html>');
  return body;
}

private print(idSelector: string): void{
  let iframe;
  let contentWin;
  let ifrm;
  // tslint:disable-next-line:no-global-variables
  iframe = document.createElement('iframe');
  iframe.style.height = '0';
  iframe.style.width = '0';
  // tslint:disable-next-line:no-global-variables
  document.body.appendChild(iframe);
  contentWin = iframe.contentWindow || iframe.window;
  // tslint:disable-next-line:no-global-variables
  ifrm = (iframe.contentWindow) ?
    iframe.contentWindow : (iframe.contentDocument.document) ?
      iframe.contentDocument.document : iframe.contentDocument;
  // tslint:disable-next-line:no-global-variables
  ifrm.document.open();
  // tslint:disable-next-line:no-global-variables
  ifrm.document.onreadystatechange = () => {

    ifrm.document.write(this.getPrintBody(idSelector)); 
    contentWin.focus();
    const result = contentWin.document.execCommand('print', false, null);
    if (!result){
      contentWin.print();
    }  
  };
  ifrm.document.close();
    iframe.style.display = 'none';
    iframe.parentNode.removeChild(iframe);



}

}

