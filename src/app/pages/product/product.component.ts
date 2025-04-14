import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // MatTableModule import
import { MatDialogModule } from '@angular/material/dialog'; // MatDialogModule import
import { MatButtonModule } from '@angular/material/button'; // MatButtonModule import
import { MatFormFieldModule } from '@angular/material/form-field'; // MatFormFieldModule import
import { MatInputModule } from '@angular/material/input'; // MatInputModule import
import { MatSelectModule } from '@angular/material/select'; // MatSelectModule import
import { ReactiveFormsModule } from '@angular/forms'; // ReactiveFormsModule import
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort'; // ADD THIS


@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSortModule,
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductManagementComponent {
  @ViewChild('productDialog') productDialog!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['name', 'price', 'quantity', 'actions'];
  productForm: FormGroup;
  currentProduct: any = null;
  dataSource = new MatTableDataSource<any>();

  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
    });

    this.dataSource.data = [
      { id: 1, name: 'Product 1', price: 500, quantity: 20 },
      { id: 2, name: 'Product 2', price: 1000, quantity: 15 },
      { id: 3, name: 'Product 3', price: 1500, quantity: 10 },
    ];
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialog(): void {
    this.currentProduct = null;
    this.productForm.reset();
    const dialogRef = this.dialog.open(this.productDialog, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addProduct(result);
      }
    });
  }

  editProduct(product: any): void {
    this.currentProduct = product;
    this.productForm.patchValue(product);
    const dialogRef = this.dialog.open(this.productDialog, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateProduct(result);
      }
    });
  }

  deleteProduct(id: number): void {
    this.dataSource.data = this.dataSource.data.filter((p) => p.id !== id);
  }

  addProduct(data: any): void {
    const newProduct = { id: this.dataSource.data.length + 1, ...data };
    this.dataSource.data = [...this.dataSource.data, newProduct];
  }

  updateProduct(data: any): void {
    if (this.currentProduct) {
      const updated = this.dataSource.data.map((p) =>
        p.id === this.currentProduct.id ? { ...p, ...data } : p
      );
      this.dataSource.data = updated;
    }
  }

  submitProduct(dialogRef: MatDialogRef<any>): void {
    const formData = this.productForm.value;
    dialogRef.close(formData);
  }
}
