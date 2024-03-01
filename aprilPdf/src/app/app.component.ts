import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {PDFDocumentProxy, PdfViewerModule} from "ng2-pdf-viewer";
import { PDFDocument} from 'pdf-lib';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PdfViewerModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'aprilPdf';
  pdfSrc: any;
  pdfSrc1: any;
  firstPage?:number;
  lastPage?:number;
  fileName?:string;
  ngOnInit() {}
   initLoadCompleted(pdf:PDFDocumentProxy) {
     this.pdfSrc1 = pdf.getPage(0);

     console.log(this.pdfSrc1)
  }
  onFileSelected() {
    let $img: any = document.querySelector('#file');
    if (typeof (FileReader) !== 'undefined') {
      let reader = new FileReader();
      reader.readAsArrayBuffer($img.files[0]);
      reader.onloadend = async (e: any) => {
        this.pdfSrc = (reader.result);
      };
    }
  }
  generateNumberList(start: number, end: number): number[] {
    const listnumber:number[]=[];
    for(let i=+start;i<=end;i++){
      listnumber.push(i)
    }
    return listnumber;
  }
  async extractPdf() {
    if( this.firstPage && this.lastPage && this.fileName){
      let pdfDoc = await PDFDocument.load(this.pdfSrc);
      let pdfCopie = await PDFDocument.create();
      let pdfCopie1 = await pdfCopie.copyPages(pdfDoc, this.generateNumberList(this.firstPage, this.lastPage));
      await pdfCopie1.forEach((page) => pdfCopie.addPage(page));
      const pdfBytes = await pdfCopie.save();
      this.saveByteArray(this.fileName + '.pdf', pdfBytes);
    }
  }
  saveByteArray(reportName:string, byte:BlobPart) {
    var blob = new Blob([byte]);
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  };
}

