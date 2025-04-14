import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InvoiceCreateComponent } from "./pages/invoice-create/invoice-create.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InvoiceCreateComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Invoic';
}
