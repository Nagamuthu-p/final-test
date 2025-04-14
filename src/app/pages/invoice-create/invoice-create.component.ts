import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.css'],
})
export class InvoiceCreateComponent {
  invoiceForm: FormGroup;

  products = [
    { id: 1, name: 'Laptop', price: 55000, gst: 18 },
    { id: 2, name: 'Mouse', price: 600, gst: 12 },
    { id: 3, name: 'Keyboard', price: 2500, gst: 18 },
    { id: 4, name: 'Monitor', price: 12000, gst: 18 },
    { id: 5, name: 'USB Cable', price: 250, gst: 5 },
  ];

  constructor(private fb: FormBuilder) {
    this.invoiceForm = this.fb.group({
      customerName: ['', Validators.required],
      invoiceDate: [
        new Date().toISOString().substring(0, 10),
        Validators.required,
      ],
      items: this.fb.array([]),
    });

    this.addItem(); // initialize with one row
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(
      this.fb.group({
        productId: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
      })
    );
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  getProduct(productId: number) {
    return this.products.find((p) => p.id === productId);
  }

  getTotalAmount(item: any): number {
    const product = this.getProduct(item.value.productId);
    if (!product) return 0;
    const base = product.price * item.value.quantity;
    return base + (base * product.gst) / 100;
  }

  getGrandTotal(): number {
    return this.items.controls.reduce(
      (sum, item) => sum + this.getTotalAmount(item),
      0
    );
  }

  submit() {
    if (this.invoiceForm.invalid) return;
    const payload = {
      customerName: this.invoiceForm.value.customerName,
      invoiceDate: this.invoiceForm.value.invoiceDate,
      products: this.items.controls.map((c) => ({
        product_id: c.value.productId,
        quantity: c.value.quantity,
      })),
    };
    console.log('Submit Invoice', payload);
    // TODO: call API
  }

//   constructor(private fb: FormBuilder, private invoiceService: InvoiceService) {
//   ...
//   this.loadProducts(); // Load products from API
// }

// loadProducts() {
//   this.invoiceService.getProducts().subscribe(data => this.products = data);
// }

  // submit() {
  //   if (this.invoiceForm.invalid) return;

  //   const payload = {
  //     customerName: this.invoiceForm.value.customerName,
  //     invoiceDate: this.invoiceForm.value.invoiceDate,
  //     products: this.items.controls.map((c) => ({
  //       product_id: c.value.productId,
  //       quantity: c.value.quantity,
  //     })),
  //   };

  //   this.invoiceService.createInvoice(payload).subscribe({
  //     next: (res) => {
  //       alert('Invoice created successfully!');
  //       this.invoiceForm.reset();
  //       this.items.clear();
  //       this.addItem(); // reset form
  //     },
  //     error: (err) => {
  //       console.error('Error creating invoice', err);
  //     },
  //   });
  // }




exportToPDF() {
  const invoice = {
    invoice_id: 103,
    invoice_date: '2025-04-14',
    customer_name: 'John Doe',
    grand_total: 4560
  };

  const invoiceItems = [
    {
      invoice_item_id: 1,
      product_id: 101,
      quantity: 2,
      price: 1000,
      gst: 18,
      total_amount: 2360
    },
    {
      invoice_item_id: 2,
      product_id: 102,
      quantity: 1,
      price: 1500,
      gst: 18,
      total_amount: 2200
    }
  ];

  const formattedDate = new Date(invoice.invoice_date).toISOString().split('T')[0];
  const customerName = invoice.customer_name.replace(/\s+/g, '_');
  const fileName = `Invoice_${customerName}_${formattedDate}_${invoice.invoice_id}.pdf`;

  const element = document.createElement('div');
  element.innerHTML = `
    <h2 style="text-align:center;">Invoice</h2>
    <p><strong>Invoice ID:</strong> ${invoice.invoice_id}</p>
    <p><strong>Customer:</strong> ${invoice.customer_name}</p>
    <p><strong>Date:</strong> ${formattedDate}</p>
    <br/>
    <table border="1" style="width:100%; border-collapse: collapse; font-size: 12px;">
      <thead>
        <tr>
          <th>Invoice Item ID</th>
          <th>Product ID</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>GST (%)</th>
          <th>Total Amount</th>
        </tr>
      </thead>
      <tbody>
        ${invoiceItems.map(p => `
          <tr>
            <td>${p.invoice_item_id}</td>
            <td>${p.product_id}</td>
            <td>${p.quantity}</td>
            <td>₹${p.price}</td>
            <td>${p.gst}</td>
            <td>₹${p.total_amount}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <br/>
    <h3>Total: ₹${invoice.grand_total}</h3>
  `;

  html2canvas(element).then(canvas => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight);
    pdf.save(fileName);
  });
}

}
