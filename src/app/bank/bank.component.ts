import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListProductsComponent } from './component/list-products/list-products.component';
import { FormProductComponent } from './component/form-product/form-product.component';
import { MatIcon } from '@angular/material/icon';
import { IconsModule } from '../core/icons/icons.module';

@Component({
  selector: 'app-bank',
  standalone: true,
  imports: [ ListProductsComponent,RouterOutlet,FormProductComponent,MatIcon,IconsModule],
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.scss'
})
export class BankComponent {

}
