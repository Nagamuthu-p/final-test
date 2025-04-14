import { Routes } from '@angular/router';
import { InvoiceCreateComponent } from './pages/invoice-create/invoice-create.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { ProductManagementComponent } from './pages/product/product.component';

export const routes: Routes = [
    {
        path: 'in',
        component:InvoiceCreateComponent
    },
    {
        path: 'pdf',
        component:InvoiceComponent
    },
    {
        path: 'product',
        component:ProductManagementComponent
    }
];
