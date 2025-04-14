import { Component, ElementRef, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  imports:[CommonModule]
})
export class InvoiceComponent {
  @ViewChild('pdfContent') pdfContent!: ElementRef;

  invoice = {
    invoice_id: 103,
    invoice_date: '2025-04-14',
    customer_name: 'John Doe',
    grand_total: 4560,
  };

  invoiceItems = [
    {
      invoice_item_id: 1,
      product_id: 101,
      quantity: 2,
      price: 1000,
      gst: 18,
      total_amount: 2360,
    },
    {
      invoice_item_id: 2,
      product_id: 102,
      quantity: 1,
      price: 1500,
      gst: 18,
      total_amount: 2200,
    },
  ];

  exportToPDF() {
    const customerName = this.invoice.customer_name.replace(/\s+/g, '_');
    const date = new Date(this.invoice.invoice_date)
      .toISOString()
      .split('T')[0];
    const fileName = `Invoice_${customerName}_${date}_${this.invoice.invoice_id}.pdf`;

    setTimeout(() => {
      html2canvas(this.pdfContent.nativeElement).then((canvas) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight);
        pdf.save(fileName);
      });
    }, 0);
  }
}
